'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  useMLEntities,
  useMLPerformance,
  useMLStatus,
  useSpendingForecast,
  useTrainModel,
} from '@/lib/queries/useMLQueries';
import { CheckCircle2, Loader, XCircle, Zap } from 'lucide-react';
import { useState } from 'react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts';

export default function MLStatusPage() {
  const [trainingId, setTrainingId] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState('all');

  const { data: statusData, isLoading: statusLoading } = useMLStatus();
  const { data: performance, isLoading: perfLoading } = useMLPerformance();
  const { data: forecastData, isLoading: forecastLoading } = useSpendingForecast(selectedEntity);
  const { mutateAsync: trainModel } = useTrainModel();
  const { data: entities = [], isLoading: entitiesLoading } = useMLEntities();

  const models = statusData?.models ?? [];

  const handleTrain = async (modelId: string, endpoint: string) => {
    setTrainingId(modelId);
    try {
      await trainModel(endpoint);
    } finally {
      setTrainingId(null);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-white mb-2'>ML Models</h1>
        <p className='text-[#94a3b8]'>Monitor and manage machine learning models (admin only)</p>
      </div>

      {/* Status Summary */}
      <Card className='bg-[#121418] border-[#1f2937] p-6'>
        <div className='grid grid-cols-3 gap-4'>
          <div>
            <p className='text-sm text-[#94a3b8] mb-1'>Total Models</p>
            <p className='text-3xl font-mono font-bold text-[#00ff88]'>
              {statusLoading ? '—' : statusData?.total}
            </p>
          </div>
          <div>
            <p className='text-sm text-[#94a3b8] mb-1'>Trained</p>
            <p className='text-3xl font-mono font-bold text-[#00ff88]'>
              {statusLoading ? '—' : statusData?.trained_count}
            </p>
          </div>
          <div>
            <p className='text-sm text-[#94a3b8] mb-1'>Ready for Training</p>
            <p className='text-3xl font-mono font-bold text-[#f59e0b]'>
              {statusLoading ? '—' : statusData?.untrained_count}
            </p>
          </div>
        </div>
      </Card>

      {/* Models Grid */}
      {statusLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {[...Array(8)].map((_, i) => (
            <Card key={i} className='bg-[#121418] border-[#1f2937] p-4 h-40 animate-pulse' />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {models.map(model => (
            <Card key={model.id} className='bg-[#121418] border-[#1f2937] p-4'>
              <div className='space-y-3'>
                {/* Name */}
                <div>
                  <h3 className='font-semibold text-white text-sm'>{model.name}</h3>
                  <p className='text-xs text-[#94a3b8]'>{model.library}</p>
                </div>

                {/* Layer */}
                <div className='text-xs bg-[#1a1d23] p-2 rounded border border-[#1f2937] text-[#e0e0e0]'>
                  {model.layer}
                </div>

                {/* Status */}
                <div className='flex items-center gap-2'>
                  {model.trained ? (
                    <>
                      <CheckCircle2 className='w-4 h-4 text-[#00ff88]' />
                      <span className='text-xs text-[#00ff88] font-semibold'>TRAINED</span>
                    </>
                  ) : (
                    <>
                      <XCircle className='w-4 h-4 text-[#f59e0b]' />
                      <span className='text-xs text-[#f59e0b] font-semibold'>UNTRAINED</span>
                    </>
                  )}
                </div>

                {/* Train button */}
                {model.trainable && model.train_endpoint && (
                  <Button
                    onClick={() => handleTrain(model.id, model.train_endpoint!)}
                    disabled={trainingId === model.id}
                    size='sm'
                    className='w-full bg-[#f59e0b]/20 text-[#f59e0b] hover:bg-[#f59e0b]/30 border border-[#f59e0b]/50'
                  >
                    {trainingId === model.id ? (
                      <>
                        <Loader className='w-3 h-3 mr-2 animate-spin' />
                        Training...
                      </>
                    ) : (
                      <>
                        <Zap className='w-3 h-3 mr-2' />
                        {model.trained ? 'Retrain' : 'Train'}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Spending Forecast */}
      <Card className='bg-[#121418] border-[#1f2937] p-6'>
        <h2 className='text-lg font-semibold text-white mb-4'>Spending Forecast</h2>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm text-[#94a3b8] mb-2'>Select Entity</label>
            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
              <SelectTrigger className='bg-[#1a1d23] border-[#1f2937]'>
                <SelectValue placeholder='Select an entity' />
              </SelectTrigger>
              <SelectContent className='bg-[#121418] border-[#1f2937]'>
                <SelectItem value='all'>All Entities</SelectItem>
                {entitiesLoading ? (
                  <SelectItem value='loading' disabled>Loading...</SelectItem>
                ) : (
                  entities.map(e => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Forecast chart */}
          {selectedEntity !== 'all' && (
            forecastLoading ? (
              <div className='flex justify-center items-center h-48'>
                <Loader className='w-6 h-6 animate-spin text-[#00ff88]' />
              </div>
            ) : forecastData?.message ? (
              <div className='bg-[#1a1d23] p-4 rounded border border-[#1f2937] text-center text-[#94a3b8]'>
                {forecastData.message}
              </div>
            ) : forecastData?.forecast?.length ? (
              <div className='space-y-4'>
                <ResponsiveContainer width='100%' height={250}>
                  <AreaChart data={forecastData.forecast}>
                    <defs>
                      <linearGradient id='forecastGrad' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#00ff88' stopOpacity={0.3} />
                        <stop offset='95%' stopColor='#00ff88' stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' stroke='#1f2937' vertical={false} />
                    <XAxis dataKey='ds' stroke='#64748b' style={{ fontSize: '11px' }} />
                    <YAxis stroke='#64748b' style={{ fontSize: '11px' }}
                      tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#121418', border: '1px solid #1f2937', borderRadius: '6px' }}
                      formatter={(v: number) => [`KES ${(v / 1_000_000).toFixed(1)}M`]}
                    />
                    <Area type='monotone' dataKey='yhat' stroke='#00ff88'
                      fill='url(#forecastGrad)' name='Forecast' />
                    <Area type='monotone' dataKey='yhat_upper' stroke='#f59e0b'
                      fill='none' strokeDasharray='4 4' name='Upper bound' />
                    <Area type='monotone' dataKey='yhat_lower' stroke='#64748b'
                      fill='none' strokeDasharray='4 4' name='Lower bound' />
                  </AreaChart>
                </ResponsiveContainer>

                {/* Anomalies */}
                {forecastData.anomalies?.length > 0 && (
                  <div className='space-y-2'>
                    <p className='text-sm text-[#94a3b8]'>
                      Spending Anomalies ({forecastData.anomalies.length})
                    </p>
                    {forecastData.anomalies.slice(0, 3).map((a, i) => (
                      <div key={i}
                        className='flex justify-between items-center bg-[#1a1d23] p-3 rounded border border-[#1f2937]'>
                        <div>
                          <p className='text-white text-sm font-mono'>{a.date}</p>
                          <p className='text-xs text-[#94a3b8]'>
                            KES {(a.actual_spend / 1_000_000).toFixed(1)}M actual
                            vs {(a.expected_spend / 1_000_000).toFixed(1)}M expected
                          </p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${a.severity === 'critical' ? 'bg-[#00ff88]/10 text-[#00ff88]' :
                            a.severity === 'high' ? 'bg-[#ef4444]/10 text-[#ef4444]' :
                              'bg-[#f59e0b]/10 text-[#f59e0b]'
                          }`}>
                          +{a.deviation_pct.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pattern summary */}
                {forecastData.pattern_summary && (
                  <div className='bg-[#1a1d23] p-3 rounded border border-[#1f2937]'>
                    <p className='text-xs text-[#94a3b8]'>{forecastData.pattern_summary}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className='bg-[#1a1d23] p-4 rounded border border-[#1f2937] text-center text-[#94a3b8]'>
                No forecast data available
              </div>
            )
          )}

          {selectedEntity === 'all' && (
            <div className='bg-[#1a1d23] p-4 rounded border border-[#1f2937] text-center text-[#94a3b8]'>
              Select an entity above to run the Prophet forecast
            </div>
          )}
        </div>
      </Card>

      {/* Model Performance */}
      {/* <Card className='bg-[#121418] border-[#1f2937] p-6'>
        <h2 className='text-lg font-semibold text-white mb-4'>Model Performance</h2>
        {perfLoading ? (
          <div className='space-y-4'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='animate-pulse'>
                <div className='h-4 bg-[#1f2937] rounded mb-2' />
                <div className='h-2 bg-[#1f2937] rounded' />
              </div>
            ))}
          </div>
        ) : (
          <div className='space-y-4'>
            {(performance ?? []).map(model => (
              <div key={model.id}>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-sm text-white'>{model.name}</span>
                  <span className='text-sm font-mono text-[#00ff88]'>
                    {model.accuracy != null
                      ? `${(model.accuracy * 100).toFixed(1)}%`
                      : 'Not evaluated'}
                  </span>
                </div>
                {model.accuracy != null && (
                  <Progress
                    value={model.accuracy * 100}
                    className='h-2'
                    indicatorClassName='bg-[#00ff88]'
                  />
                )}
              </div>
            ))}
            {(performance ?? []).length === 0 && (
              <p className='text-[#94a3b8] text-sm text-center py-4'>
                No trained models to evaluate yet.
              </p>
            )}
          </div>
        )}
      </Card> */}
    </div>
  );
}