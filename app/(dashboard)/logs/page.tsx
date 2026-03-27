'use client';

import { Pagination } from '@/components/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLogs } from '@/lib/queries/useLogQueries';
import {
  AuditAction,
  AuditEntityType,
  AuditLogEntry,
  LogFilterParams,
} from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { Activity, Eye, RefreshCw, Shield } from 'lucide-react';
import { useState } from 'react';

// ─── Action category colours ──────────────────────────────────────────────────

const ACTION_COLORS: Partial<Record<AuditAction, string>> = {
  LOGIN: 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20',
  LOGOUT: 'bg-[#1a1d23] text-[#94a3b8] border-[#1f2937]',
  TOKEN_REFRESHED: 'bg-[#1a1d23] text-[#94a3b8] border-[#1f2937]',
  PASSWORD_CHANGED: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
  USER_CREATED: 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20',
  USER_UPDATED: 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20',
  USER_DEACTIVATED: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20',
  ROLE_ASSIGNED: 'bg-[#a78bfa]/10 text-[#a78bfa] border-[#a78bfa]/20',
  ROLE_REMOVED: 'bg-[#a78bfa]/10 text-[#a78bfa] border-[#a78bfa]/20',
  CLAIM_INGESTED: 'bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/20',
  CLAIM_STATUS_UPDATED: 'bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/20',
  CLAIM_SCORED: 'bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/20',
  SCORE_OVERRIDDEN: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
  CASE_CREATED: 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20',
  CASE_ASSIGNED: 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20',
  CASE_STATUS_UPDATED: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
  CASE_NOTE_ADDED: 'bg-[#1a1d23] text-[#94a3b8] border-[#1f2937]',
  CASE_CLOSED: 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20',
  RULE_CREATED: 'bg-[#a78bfa]/10 text-[#a78bfa] border-[#a78bfa]/20',
  RULE_UPDATED: 'bg-[#a78bfa]/10 text-[#a78bfa] border-[#a78bfa]/20',
  RULE_TOGGLED: 'bg-[#a78bfa]/10 text-[#a78bfa] border-[#a78bfa]/20',
  MODEL_REGISTERED: 'bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/20',
  MODEL_DEPLOYED: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20',
};

const ACTION_GROUPS: { label: string; actions: AuditAction[] }[] = [
  {
    label: 'Auth',
    actions: ['LOGIN', 'LOGOUT', 'TOKEN_REFRESHED', 'PASSWORD_CHANGED'],
  },
  {
    label: 'Users',
    actions: [
      'USER_CREATED',
      'USER_UPDATED',
      'USER_DEACTIVATED',
      'ROLE_ASSIGNED',
      'ROLE_REMOVED',
    ],
  },
  {
    label: 'Claims',
    actions: [
      'CLAIM_INGESTED',
      'CLAIM_STATUS_UPDATED',
      'FEATURES_COMPUTED',
      'CLAIM_SCORED',
      'SCORE_OVERRIDDEN',
    ],
  },
  {
    label: 'Cases',
    actions: [
      'CASE_CREATED',
      'CASE_ASSIGNED',
      'CASE_STATUS_UPDATED',
      'CASE_NOTE_ADDED',
      'CASE_CLOSED',
    ],
  },
  {
    label: 'Admin',
    actions: [
      'RULE_CREATED',
      'RULE_UPDATED',
      'RULE_TOGGLED',
      'MODEL_REGISTERED',
      'MODEL_DEPLOYED',
    ],
  },
];

const ENTITY_TYPES: AuditEntityType[] = [
  'Claim',
  'FraudCase',
  'FraudAlert',
  'User',
  'FraudRule',
  'ModelVersion',
  'FraudReport',
];

export default function LogsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filterAction, setFilterAction] = useState('');
  const [filterEntityType, setFilterEntityType] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(
    null,
  );
  const [detailOpen, setDetailOpen] = useState(false);

  const filters: LogFilterParams = {};
  if (filterAction && filterAction !== 'all')
    filters.action = filterAction as AuditAction;
  if (filterEntityType && filterEntityType !== 'all')
    filters.entityType = filterEntityType;
  if (filterUserId.trim()) filters.userId = filterUserId.trim();
  if (filterFromDate) filters.fromDate = new Date(filterFromDate).toISOString();
  if (filterToDate) filters.toDate = new Date(filterToDate).toISOString();

  const {
    data: logsResponse,
    isLoading,
    refetch,
    isFetching,
  } = useLogs(filters, page, pageSize);

  const handleClearFilters = () => {
    setFilterAction('');
    setFilterEntityType('');
    setFilterUserId('');
    setFilterFromDate('');
    setFilterToDate('');
    setPage(1);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-white flex items-center gap-3'>
            <Shield className='h-7 w-7 text-[#94a3b8]' />
            Audit Logs
          </h1>
          <p className='text-[#94a3b8] mt-1'>
            Immutable system-wide activity trail — admin access only
          </p>
        </div>
        <Button
          variant='outline'
          onClick={() => refetch()}
          disabled={isFetching}
          className='border-[#1f2937] text-[#94a3b8] bg-transparent hover:bg-[#1a1d23] hover:text-white'
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>
      {/* Summary cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <Card className='bg-[#121418] border-[#1f2937] p-4'>
          <p className='text-sm text-[#64748b] mb-1'>Total Entries</p>
          <p className='text-2xl font-bold text-white font-mono'>
            {isLoading
              ? '—'
              : (logsResponse?.pagination.total ?? 0).toLocaleString()}
          </p>
        </Card>
        <Card className='bg-[#121418] border-[#1f2937] p-4'>
          <p className='text-sm text-[#64748b] mb-1'>This Page</p>
          <p className='text-2xl font-bold text-white font-mono'>
            {isLoading ? '—' : (logsResponse?.data.length ?? 0)}
          </p>
        </Card>
        <Card className='bg-[#121418] border-[#1f2937] p-4'>
          <p className='text-sm text-[#64748b] mb-1'>Auto-refresh</p>
          <p className='text-sm font-medium text-[#00ff88] mt-1 flex items-center gap-1'>
            <Activity className='h-4 w-4' /> Every 30s
          </p>
        </Card>
        <Card className='bg-[#121418] border-[#1f2937] p-4'>
          <p className='text-sm text-[#64748b] mb-1'>Access</p>
          <p className='text-sm font-medium text-[#a78bfa] mt-1'>Admin only</p>
        </Card>
      </div>
      {/* Filters */}
      <Card className='bg-[#121418] border-[#1f2937] p-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3'>
          <Select
            value={filterAction || 'all'}
            onValueChange={v => {
              setFilterAction(v === 'all' ? '' : v);
              setPage(1);
            }}
          >
            <SelectTrigger className='bg-[#1a1d23] border-[#1f2937] text-white'>
              <SelectValue placeholder='All actions' />
            </SelectTrigger>
            <SelectContent className='bg-[#121418] border-[#1f2937]'>
              <SelectItem
                value='all'
                className='text-white focus:bg-[#1a1d23] focus:text-white'
              >
                All Actions
              </SelectItem>
              {ACTION_GROUPS.map(group => (
                <div key={group.label}>
                  <div className='px-2 py-1.5 text-xs font-semibold text-[#64748b] uppercase tracking-wide'>
                    {group.label}
                  </div>
                  {group.actions.map(a => (
                    <SelectItem
                      key={a}
                      value={a}
                      className='text-[#94a3b8] focus:bg-[#1a1d23] focus:text-white'
                    >
                      {a.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filterEntityType || 'all'}
            onValueChange={v => {
              setFilterEntityType(v === 'all' ? '' : v);
              setPage(1);
            }}
          >
            <SelectTrigger className='bg-[#1a1d23] border-[#1f2937] text-white'>
              <SelectValue placeholder='All entities' />
            </SelectTrigger>
            <SelectContent className='bg-[#121418] border-[#1f2937]'>
              <SelectItem
                value='all'
                className='text-white focus:bg-[#1a1d23] focus:text-white'
              >
                All Entity Types
              </SelectItem>
              {ENTITY_TYPES.map(e => (
                <SelectItem
                  key={e}
                  value={e}
                  className='text-[#94a3b8] focus:bg-[#1a1d23] focus:text-white'
                >
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder='User ID (UUID)...'
            value={filterUserId}
            onChange={e => {
              setFilterUserId(e.target.value);
              setPage(1);
            }}
            className='bg-[#1a1d23] border-[#1f2937] text-white placeholder-[#64748b]'
          />
          <Input
            type='datetime-local'
            value={filterFromDate}
            onChange={e => {
              setFilterFromDate(e.target.value);
              setPage(1);
            }}
            title='From date'
            className='bg-[#1a1d23] border-[#1f2937] text-white'
          />
          <Input
            type='datetime-local'
            value={filterToDate}
            onChange={e => {
              setFilterToDate(e.target.value);
              setPage(1);
            }}
            title='To date'
            className='bg-[#1a1d23] border-[#1f2937] text-white'
          />
          <Select
            value={String(pageSize)}
            onValueChange={v => setPageSize(parseInt(v))}
          >
            <SelectTrigger className='bg-[#1a1d23] border-[#1f2937] text-white'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='bg-[#121418] border-[#1f2937]'>
              <SelectItem
                value='10'
                className='text-[#94a3b8] focus:bg-[#1a1d23] focus:text-white'
              >
                10 per page
              </SelectItem>
              <SelectItem
                value='25'
                className='text-[#94a3b8] focus:bg-[#1a1d23] focus:text-white'
              >
                25 per page
              </SelectItem>
              <SelectItem
                value='50'
                className='text-[#94a3b8] focus:bg-[#1a1d23] focus:text-white'
              >
                50 per page
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(filterAction ||
          filterEntityType ||
          filterUserId ||
          filterFromDate ||
          filterToDate) && (
          <div className='mt-3 flex justify-end'>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleClearFilters}
              className='text-[#64748b] hover:text-white hover:bg-[#1a1d23]'
            >
              Clear all filters
            </Button>
          </div>
        )}
      </Card>
      {/* Logs Table */}
      <Card className='bg-[#121418] border-[#1f2937] overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow className='border-[#1f2937] hover:bg-transparent bg-[#0d0f12]'>
              <TableHead className='text-[#64748b] font-semibold'>
                Timestamp
              </TableHead>
              <TableHead className='text-[#64748b] font-semibold'>
                User
              </TableHead>
              <TableHead className='text-[#64748b] font-semibold'>
                Action
              </TableHead>
              <TableHead className='text-[#64748b] font-semibold'>
                Entity Type
              </TableHead>
              <TableHead className='text-[#64748b] font-semibold'>
                Entity ID
              </TableHead>
              <TableHead className='text-[#64748b] font-semibold'>
                IP Address
              </TableHead>
              <TableHead className='text-right text-[#64748b] font-semibold'>
                Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className='border-[#1f2937]'>
                <TableCell colSpan={7} className='h-20 text-center'>
                  <div className='flex items-center justify-center gap-2 text-[#94a3b8]'>
                    <div className='h-5 w-5 animate-spin rounded-full border-2 border-[#1f2937] border-t-[#00ff88]' />
                    Loading audit logs...
                  </div>
                </TableCell>
              </TableRow>
            ) : !logsResponse?.data?.length ? (
              <TableRow className='border-[#1f2937]'>
                <TableCell
                  colSpan={7}
                  className='h-20 text-center text-[#94a3b8]'
                >
                  <div className='flex flex-col items-center gap-2'>
                    <Activity className='h-8 w-8 text-[#1f2937]' />
                    No log entries found
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logsResponse.data.map(entry => (
                <TableRow
                  key={entry.id}
                  className='border-[#1f2937] hover:bg-[#1a1d23] font-mono text-xs'
                >
                  <TableCell className='text-[#94a3b8] whitespace-nowrap'>
                    {formatDateTime(new Date(entry.performedAt))}
                  </TableCell>
                  <TableCell>
                    {entry.userFullName ? (
                      <div>
                        <p className='font-medium text-white font-sans text-sm'>
                          {entry.userFullName}
                        </p>
                        <p className='text-[#64748b] text-xs'>
                          {entry.userEmail}
                        </p>
                      </div>
                    ) : (
                      <span className='text-[#64748b] italic font-sans'>
                        System
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs font-mono border ${ACTION_COLORS[entry.action] ?? 'bg-[#1a1d23] text-[#94a3b8] border-[#1f2937]'}`}
                    >
                      {entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-[#94a3b8]'>
                    {entry.entityType ?? (
                      <span className='text-[#64748b]'>—</span>
                    )}
                  </TableCell>
                  <TableCell
                    className='text-[#64748b] max-w-35 truncate'
                    title={entry.entityId ?? ''}
                  >
                    {entry.entityId ? (
                      <span className='font-mono text-[#94a3b8]'>
                        {entry.entityId.split('-')[0]}…
                      </span>
                    ) : (
                      <span className='text-[#64748b]'>—</span>
                    )}
                  </TableCell>
                  <TableCell className='text-[#94a3b8]'>
                    {entry.ipAddress ?? (
                      <span className='text-[#64748b]'>—</span>
                    )}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-[#64748b] hover:text-white hover:bg-[#1a1d23]'
                      onClick={() => {
                        setSelectedEntry(entry);
                        setDetailOpen(true);
                      }}
                    >
                      <Eye className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      {/* Pagination */}
      {!isLoading && logsResponse && (
        <Pagination
          page={page}
          totalPages={logsResponse.pagination.totalPages}
          onPageChange={setPage}
          total={logsResponse.pagination.total}
          pageSize={pageSize}
        />
      )}
      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto bg-[#121418] border-[#1f2937] text-white'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 font-mono'>
              <Badge
                className={`border ${ACTION_COLORS[selectedEntry?.action as AuditAction] ?? 'bg-[#1a1d23] text-[#94a3b8] border-[#1f2937]'}`}
              >
                {selectedEntry?.action}
              </Badge>
              <span className='text-sm font-normal text-[#94a3b8]'>
                {selectedEntry &&
                  formatDateTime(new Date(selectedEntry.performedAt))}
              </span>
            </DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className='space-y-4 text-sm'>
              <div className='grid grid-cols-2 gap-4'>
                <Card className='bg-[#1a1d23] border-[#1f2937] p-3'>
                  <p className='text-xs text-[#64748b] mb-1'>User</p>
                  <p className='font-medium text-white'>
                    {selectedEntry.userFullName ?? 'System'}
                  </p>
                  {selectedEntry.userEmail && (
                    <p className='text-[#64748b] text-xs'>
                      {selectedEntry.userEmail}
                    </p>
                  )}
                </Card>
                <Card className='bg-[#1a1d23] border-[#1f2937] p-3'>
                  <p className='text-xs text-[#64748b] mb-1'>Entity</p>
                  <p className='font-medium text-white'>
                    {selectedEntry.entityType ?? '—'}
                  </p>
                  <p className='text-[#64748b] text-xs font-mono truncate'>
                    {selectedEntry.entityId ?? '—'}
                  </p>
                </Card>
                <Card className='bg-[#1a1d23] border-[#1f2937] p-3'>
                  <p className='text-xs text-[#64748b] mb-1'>IP Address</p>
                  <p className='font-mono text-[#00ff88]'>
                    {selectedEntry.ipAddress ?? '—'}
                  </p>
                </Card>
                <Card className='bg-[#1a1d23] border-[#1f2937] p-3'>
                  <p className='text-xs text-[#64748b] mb-1'>Log ID</p>
                  <p className='font-mono text-xs text-[#94a3b8] truncate'>
                    {selectedEntry.id}
                  </p>
                </Card>
              </div>
              {selectedEntry.userAgent && (
                <Card className='bg-[#1a1d23] border-[#1f2937] p-3'>
                  <p className='text-xs text-[#64748b] mb-1'>User Agent</p>
                  <p className='text-[#94a3b8] text-xs break-all'>
                    {selectedEntry.userAgent}
                  </p>
                </Card>
              )}
              {Object.keys(selectedEntry.metadata).length > 0 && (
                <Card className='bg-[#1a1d23] border-[#1f2937] p-3'>
                  <p className='text-xs text-[#64748b] mb-2'>Metadata</p>
                  <pre className='text-xs text-[#00ff88] bg-[#0d0f12] p-3 rounded overflow-x-auto whitespace-pre-wrap font-mono'>
                    {JSON.stringify(selectedEntry.metadata, null, 2)}
                  </pre>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
