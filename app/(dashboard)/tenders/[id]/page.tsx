'use client';

import { RiskBadge } from '@/components/RiskBadge';
import { RiskGauge } from '@/components/RiskGauge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  tenderKeys,
  useAnalyzeTenderRisk,
  useTender,
} from '@/lib/queries/useTendersQueries';
import { useAuthStore } from '@/lib/store';
import { daysUntil, formatDate, formatKES, timeUntil } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  ExternalLink,
  FileText,
  Lock,
  RefreshCw,
  Users,
} from 'lucide-react';
import { useParams } from 'next/navigation';

export default function TenderDetailPage() {
  const { id: tenderId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: tender, isLoading, error } = useTender(tenderId);
  const { mutate: analyzeRisk, isPending: isAnalyzing } =
    useAnalyzeTenderRisk(tenderId);
  const roles = useAuthStore(state => state.user?.roles ?? []);
  const canInvestigate =
    roles.includes('investigator') || roles.includes('admin');
  const handleReanalyze = () => {
    analyzeRisk(true, {
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: tenderKeys.detail(tenderId),
        }),
    });
  };
  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-32' />
        <Skeleton className='h-96' />
      </div>
    );
  }
  if (error || !tender) {
    return (
      <Card className='bg-[#121418] border-[#ef4444]/30 p-6'>
        <div className='flex gap-3'>
          <AlertCircle className='w-5 h-5 text-[#ef4444] shrink-0 mt-0.5' />
          <div>
            <h3 className='font-semibold text-[#ef4444]'>
              Error Loading Tender
            </h3>
            <p className='text-sm text-[#94a3b8] mt-1'>
              {error instanceof Error ? error.message : 'Tender not found'}
            </p>
          </div>
        </div>
      </Card>
    );
  }
  const daysLeft = daysUntil(tender.submission_deadline);
  const timeLeft = timeUntil(tender.submission_deadline);
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <h1 className='text-3xl font-bold text-white mb-2'>{tender.title}</h1>
          <div className='flex flex-wrap gap-4 mb-4'>
            <div>
              <p className='text-sm text-[#94a3b8]'>Reference</p>
              <p className='font-mono text-[#00ff88]'>
                {tender.reference_number}
              </p>
            </div>
            <div>
              <p className='text-sm text-[#94a3b8]'>Procuring Entity</p>
              <p className='text-white'>{tender.entity.name}</p>
            </div>
            <div>
              <p className='text-sm text-[#94a3b8]'>Method</p>
              <p className='text-white capitalize'>
                {tender.procurement_method}
              </p>
            </div>
          </div>
          <div className='flex flex-wrap gap-3'>
            {tender.risk_score && (
              <RiskBadge
                level={tender.risk_score.risk_level}
                score={tender.risk_score.total_score}
              />
            )}
            <div className='px-3 py-1.5 bg-[#1a1d23] border border-[#1f2937] rounded text-sm'>
              <span className='text-[#94a3b8]'>Status: </span>
              <span className='text-white capitalize'>{tender.status}</span>
            </div>
          </div>
        </div>
        {/* Risk Gauge */}
        {tender.risk_score && (
          <Card className='bg-[#121418] border-[#1f2937] p-6 flex flex-col items-center'>
            <RiskGauge score={tender.risk_score.total_score} size='md' />
            <Button
              onClick={handleReanalyze}
              disabled={isAnalyzing}
              variant='outline'
              size='sm'
              className='mt-4 border-[#1f2937] w-full'
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`}
              />
              {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
            </Button>
            {tender.risk_score.analyzed_at && (
              <p className='text-xs text-[#64748b] mt-2 text-center'>
                Last analyzed {formatDate(tender.risk_score.analyzed_at)}
              </p>
            )}
          </Card>
        )}
      </div>
      {/* Value & Deadline */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <p className='text-sm text-[#94a3b8] mb-2'>Estimated Value</p>
          <p className='text-2xl font-mono font-bold text-[#00ff88]'>
            {formatKES(tender.estimated_value)}
          </p>
        </Card>
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <p className='text-sm text-[#94a3b8] mb-2'>Submission Deadline</p>
          <p className='text-lg font-mono text-white'>
            {formatDate(tender.submission_deadline)}
          </p>
          <p
            className={`text-sm ${daysLeft < 0 ? 'text-[#ef4444]' : 'text-[#00ff88]'}`}
          >
            {timeLeft}
          </p>
        </Card>
        <Card className='bg-[#121418] border-[#1f2937] p-6'>
          <p className='text-sm text-[#94a3b8] mb-2'>County</p>
          <p className='text-lg font-mono text-white'>{tender.county}</p>
        </Card>
      </div>
      {/* Tabs */}
      <Card className='bg-[#121418] border-[#1f2937]'>
        <Tabs defaultValue='overview' className='w-full'>
          <TabsList className='bg-[#0f1117] border-b border-[#1f2937] w-full justify-start p-4 h-auto'>
            <TabsTrigger
              value='overview'
              className='text-[#94a3b8] data-[state=active]:text-[#00ff88]'
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value='risks'
              className='text-[#94a3b8] data-[state=active]:text-[#00ff88]'
            >
              <AlertCircle className='w-4 h-4 mr-2' /> Risks & Flags
            </TabsTrigger>
            <TabsTrigger
              value='bids'
              className='text-[#94a3b8] data-[state=active]:text-[#00ff88]'
            >
              <Users className='w-4 h-4 mr-2' /> Bids
            </TabsTrigger>
            <TabsTrigger
              value='documents'
              className='text-[#94a3b8] data-[state=active]:text-[#00ff88]'
            >
              <FileText className='w-4 h-4 mr-2' /> Documents
            </TabsTrigger>
            {canInvestigate && (
              <TabsTrigger
                value='investigation'
                className='text-[#94a3b8] data-[state=active]:text-[#00ff88]'
              >
                <Lock className='w-4 h-4 mr-2' /> Investigation
              </TabsTrigger>
            )}
          </TabsList>
          <div className='p-6'>
            <TabsContent value='overview' className='space-y-4'>
              <div>
                <h3 className='text-lg font-semibold text-white mb-3'>
                  Description
                </h3>
                <p className='text-[#e0e0e0] leading-relaxed text-sm whitespace-pre-wrap'>
                  {tender.description}
                </p>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-[#1a1d23] p-4 rounded border border-[#1f2937]'>
                  <p className='text-xs text-[#94a3b8] mb-1'>Category</p>
                  <p className='text-white'>{tender.category}</p>
                </div>
                <div className='bg-[#1a1d23] p-4 rounded border border-[#1f2937]'>
                  <p className='text-xs text-[#94a3b8] mb-1'>Created</p>
                  <p className='text-white'>{formatDate(tender.created_at)}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value='risks' className='space-y-4'>
              {tender.risk_score?.ai_analysis ? (
                <div className='bg-[#1a1d23] p-4 rounded border border-[#1f2937] text-xs text-[#e0e0e0] leading-relaxed font-mono'>
                  {tender.risk_score.ai_analysis}
                </div>
              ) : (
                <p className='text-[#94a3b8]'>No AI analysis available</p>
              )}
              {tender.red_flags && tender.red_flags.length > 0 && (
                <div className='space-y-3'>
                  <h4 className='font-semibold text-white'>Red Flags</h4>
                  {tender.red_flags.map((flag, idx) => (
                    <Card
                      key={idx}
                      className='bg-[#1a1d23] border-l-4 border-t-0 border-r-0 border-b-0 p-4'
                      style={{
                        borderLeftColor:
                          flag.severity === 'critical'
                            ? '#00ff88'
                            : flag.severity === 'high'
                              ? '#ef4444'
                              : flag.severity === 'medium'
                                ? '#f59e0b'
                                : '#64748b',
                      }}
                    >
                      <div className='flex justify-between items-start mb-2'>
                        <h5 className='font-semibold text-white'>
                          {flag.flag_type}
                        </h5>
                        <RiskBadge
                          level={flag.severity}
                          size='sm'
                          showScore={false}
                        />
                      </div>
                      <p className='text-sm text-[#e0e0e0]'>
                        {flag.description}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value='bids'>
              {tender.bids && tender.bids.length > 0 ? (
                <div className='space-y-3'>
                  {tender.bids.map(bid => (
                    <Card
                      key={bid.id}
                      className='bg-[#1a1d23] border-[#1f2937] p-4'
                    >
                      <div className='flex justify-between items-start mb-2'>
                        <div>
                          <h4 className='font-semibold text-white'>
                            {bid.supplier_name}
                          </h4>
                          <p className='text-sm text-[#94a3b8]'>
                            {formatKES(bid.amount)}
                          </p>
                        </div>
                        {bid.is_winner && (
                          <span className='px-2 py-1 bg-[#00ff88] text-black text-xs font-semibold rounded'>
                            WINNER
                          </span>
                        )}
                      </div>
                      {bid.similarity_score && (
                        <p className='text-xs text-[#64748b]'>
                          Collusion similarity:{' '}
                          {(bid.similarity_score * 100).toFixed(1)}%
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <p className='text-[#94a3b8]'>No bids available</p>
              )}
            </TabsContent>
            <TabsContent value='documents'>
              {tender.documents && tender.documents.length > 0 ? (
                <div className='space-y-2'>
                  {tender.documents.map(doc => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center justify-between p-3 bg-[#1a1d23] border border-[#1f2937] rounded hover:border-[#00ff88] transition group'
                    >
                      <span className='text-white group-hover:text-[#00ff88]'>
                        {doc.filename}
                      </span>
                      <ExternalLink className='w-4 h-4 text-[#94a3b8]' />
                    </a>
                  ))}
                </div>
              ) : (
                <p className='text-[#94a3b8]'>No documents available</p>
              )}
            </TabsContent>
            {canInvestigate && (
              <TabsContent value='investigation'>
                <p className='text-[#94a3b8]'>
                  Investigation package coming soon...
                </p>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
