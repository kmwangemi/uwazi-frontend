'use client';

import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useInvestigationsList,
  useWhistleblowerList,
} from '@/lib/queries/useInvestigations';
import { Download, FileText, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function InvestigationsPage() {
  const [invSearch, setInvSearch] = useState('');
  const [wbSearch, setWbSearch] = useState('');
  const [invPage, setInvPage] = useState(1);
  const [wbPage, setWbPage] = useState(1);

  const { data: invData, isLoading: invLoading } = useInvestigationsList({
    search: invSearch,
    page: invPage,
    limit: 20,
  });

  const { data: wbData, isLoading: wbLoading } = useWhistleblowerList({
    search: wbSearch,
    page: wbPage,
    limit: 20,
  });

  const investigations = invData?.items ?? [];
  const wbReports = wbData?.items ?? [];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-white mb-2'>Investigations</h1>
        <p className='text-[#94a3b8]'>
          Manage and track active corruption investigations
        </p>
      </div>

      <Tabs defaultValue='investigations' className='w-full'>
        <TabsList className='bg-[#121418] border-b border-[#1f2937] w-full justify-start'>
          <TabsTrigger value='investigations'>
            Active Investigations
            {invData?.total ? (
              <span className='ml-2 text-xs bg-[#1f2937] px-1.5 py-0.5 rounded'>
                {invData.total}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value='whistleblower'>
            Whistleblower Reports
            {wbData?.total ? (
              <span className='ml-2 text-xs bg-[#1f2937] px-1.5 py-0.5 rounded'>
                {wbData.total}
              </span>
            ) : null}
          </TabsTrigger>
        </TabsList>

        {/* ── Investigations tab ─────────────────────────────────────────────── */}
        <TabsContent value='investigations' className='space-y-4'>
          <Input
            placeholder='Search investigations...'
            value={invSearch}
            onChange={e => {
              setInvSearch(e.target.value);
              setInvPage(1);
            }}
            className='bg-[#121418] border-[#1f2937]'
          />

          {invLoading ? (
            <div className='space-y-4'>
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className='h-48' />
              ))}
            </div>
          ) : investigations.length === 0 ? (
            <Card className='bg-[#121418] border-[#1f2937] p-8 text-center text-[#94a3b8]'>
              No investigations found.
            </Card>
          ) : (
            <div className='space-y-4'>
              {investigations.map(inv => (
                <Card
                  key={inv.id}
                  className='bg-[#121418] border-[#1f2937] p-6'
                >
                  <div className='flex justify-between items-start mb-4'>
                    <div className='flex-1'>
                      <h3 className='text-lg font-semibold text-white'>
                        {inv.title}
                      </h3>
                      <p className='text-sm text-[#94a3b8] mt-1'>
                        {inv.tender_ref ?? '—'}
                      </p>
                    </div>
                    {inv.risk_level && (
                      <RiskBadge
                        level={inv.risk_level as any}
                        showScore={false}
                      />
                    )}
                  </div>

                  <div className='grid grid-cols-3 gap-4 mb-4 py-4 border-y border-[#1f2937]'>
                    <div>
                      <p className='text-xs text-[#94a3b8]'>Status</p>
                      <p className='text-white font-semibold uppercase'>
                        {inv.status}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs text-[#94a3b8]'>Opened</p>
                      <p className='text-white'>
                        {new Date(inv.opened_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs text-[#94a3b8]'>Investigator</p>
                      <p className='text-white'>
                        {inv.investigator_name ?? '—'}
                      </p>
                    </div>
                  </div>

                  {inv.findings && (
                    <div className='mb-4'>
                      <p className='text-sm text-[#94a3b8] mb-2'>
                        Key Findings
                      </p>
                      <p className='text-white text-sm'>{inv.findings}</p>
                    </div>
                  )}

                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='border-[#1f2937]'
                    >
                      <FileText className='w-4 h-4 mr-2' />
                      Package
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='border-[#1f2937]'
                    >
                      <Download className='w-4 h-4 mr-2' />
                      Export
                    </Button>
                  </div>
                </Card>
              ))}

              {/* Pagination */}
              {invData && invData.pages > 1 && (
                <div className='flex justify-center gap-2 pt-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='border-[#1f2937]'
                    disabled={invPage === 1}
                    onClick={() => setInvPage(p => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className='text-[#94a3b8] text-sm self-center'>
                    Page {invPage} of {invData.pages}
                  </span>
                  <Button
                    variant='outline'
                    size='sm'
                    className='border-[#1f2937]'
                    disabled={invPage === invData.pages}
                    onClick={() => setInvPage(p => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* ── Whistleblower tab ──────────────────────────────────────────────── */}
        <TabsContent value='whistleblower' className='space-y-4'>
          <Input
            placeholder='Search reports...'
            value={wbSearch}
            onChange={e => {
              setWbSearch(e.target.value);
              setWbPage(1);
            }}
            className='bg-[#121418] border-[#1f2937]'
          />

          {wbLoading ? (
            <div className='space-y-4'>
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className='h-40' />
              ))}
            </div>
          ) : wbReports.length === 0 ? (
            <Card className='bg-[#121418] border-[#1f2937] p-8 text-center text-[#94a3b8]'>
              No reports found.
            </Card>
          ) : (
            <div className='space-y-4'>
              {wbReports.map(report => (
                <Card
                  key={report.id}
                  className='bg-[#121418] border-[#1f2937] p-6'
                >
                  <div className='flex justify-between items-start mb-3'>
                    <div>
                      <p className='text-sm text-[#94a3b8]'>
                        {new Date(report.submitted_at).toLocaleDateString()}
                      </p>
                      <h3 className='text-lg font-semibold text-white mt-1'>
                        {report.allegation_type ?? 'Unknown allegation'}
                      </h3>
                      {report.entity_name && (
                        <p className='text-sm text-[#94a3b8]'>
                          {report.entity_name}
                        </p>
                      )}
                    </div>
                    {report.urgency && (
                      <RiskBadge
                        level={report.urgency as any}
                        showScore={false}
                        size='sm'
                      />
                    )}
                  </div>

                  <p className='text-white mb-3 text-sm'>
                    {report.report_text}
                  </p>

                  {report.ai_triage_summary && (
                    <div className='bg-[#1a1d23] rounded p-3 mb-3 border border-[#1f2937]'>
                      <p className='text-xs text-[#94a3b8] mb-1'>
                        AI Triage Summary
                      </p>
                      <p className='text-sm text-[#e0e0e0]'>
                        {report.ai_triage_summary}
                      </p>
                    </div>
                  )}

                  <div className='flex justify-between items-end'>
                    <div className='flex items-center gap-6'>
                      <div>
                        <p className='text-xs text-[#94a3b8]'>
                          Credibility Score
                        </p>
                        <p className='text-lg font-mono font-bold text-[#00ff88]'>
                          {report.credibility_score != null
                            ? `${report.credibility_score.toFixed(0)}%`
                            : '—'}
                        </p>
                      </div>
                      <div>
                        <p className='text-xs text-[#94a3b8]'>Status</p>
                        <p
                          className={`font-semibold ${report.is_reviewed ? 'text-[#00ff88]' : 'text-[#f59e0b]'}`}
                        >
                          {report.is_reviewed ? 'Reviewed' : 'Pending'}
                        </p>
                      </div>
                      {report.tender_reference && (
                        <div>
                          <p className='text-xs text-[#94a3b8]'>Tender Ref</p>
                          <p className='text-white text-sm font-mono'>
                            {report.tender_reference}
                          </p>
                        </div>
                      )}
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      className='border-[#1f2937]'
                    >
                      <MessageSquare className='w-4 h-4 mr-2' />
                      Details
                    </Button>
                  </div>
                </Card>
              ))}

              {/* Pagination */}
              {wbData && wbData.pages > 1 && (
                <div className='flex justify-center gap-2 pt-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='border-[#1f2937]'
                    disabled={wbPage === 1}
                    onClick={() => setWbPage(p => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className='text-[#94a3b8] text-sm self-center'>
                    Page {wbPage} of {wbData.pages}
                  </span>
                  <Button
                    variant='outline'
                    size='sm'
                    className='border-[#1f2937]'
                    disabled={wbPage === wbData.pages}
                    onClick={() => setWbPage(p => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
