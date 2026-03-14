'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader, Zap, CheckCircle2 } from 'lucide-react'

const models = [
  {
    name: 'XGBoost Synthetic',
    library: 'XGBoost',
    layer: 'Risk scoring',
    trained: true,
    trainable: true,
  },
  {
    name: 'Price Anomaly Detector',
    library: 'Isolation Forest',
    layer: 'Price validation',
    trained: true,
    trainable: true,
  },
  {
    name: 'Collusion Vectorizer',
    library: 'Doc2Vec',
    layer: 'Bid analysis',
    trained: false,
    trainable: true,
  },
  {
    name: 'Specification Analyzer',
    library: 'spaCy NER',
    layer: 'Text analysis',
    trained: true,
    trainable: false,
  },
  {
    name: 'Entity Linker',
    library: 'Custom Graph',
    layer: 'Relationship mapping',
    trained: true,
    trainable: false,
  },
  {
    name: 'Risk Aggregator',
    library: 'Neural Network',
    layer: 'Score synthesis',
    trained: true,
    trainable: true,
  },
  {
    name: 'Ghost Company Detector',
    library: 'Random Forest',
    layer: 'Supplier validation',
    trained: false,
    trainable: true,
  },
  {
    name: 'Trend Forecaster',
    library: 'LSTM',
    layer: 'Spending prediction',
    trained: true,
    trainable: true,
  },
]

export default function MLStatusPage() {
  const [trainingModel, setTrainingModel] = useState<string | null>(null)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [selectedEntity, setSelectedEntity] = useState('all')

  const handleTrain = (modelName: string) => {
    setTrainingModel(modelName)
    // Simulate training
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        setTrainingProgress(100)
        clearInterval(interval)
        setTimeout(() => {
          setTrainingModel(null)
          setTrainingProgress(0)
        }, 1000)
      } else {
        setTrainingProgress(progress)
      }
    }, 500)
  }

  const trainedCount = models.filter((m) => m.trained).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">ML Models</h1>
        <p className="text-[#94a3b8]">Monitor and manage machine learning models (admin only)</p>
      </div>

      {/* Status Summary */}
      <Card className="bg-[#121418] border-[#1f2937] p-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-[#94a3b8] mb-1">Total Models</p>
            <p className="text-3xl font-mono font-bold text-[#00ff88]">{models.length}</p>
          </div>
          <div>
            <p className="text-sm text-[#94a3b8] mb-1">Trained</p>
            <p className="text-3xl font-mono font-bold text-[#00ff88]">{trainedCount}</p>
          </div>
          <div>
            <p className="text-sm text-[#94a3b8] mb-1">Ready for Training</p>
            <p className="text-3xl font-mono font-bold text-[#f59e0b]">
              {models.filter((m) => !m.trained && m.trainable).length}
            </p>
          </div>
        </div>
      </Card>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {models.map((model) => (
          <Card key={model.name} className="bg-[#121418] border-[#1f2937] p-4">
            <div className="space-y-3">
              {/* Name */}
              <div>
                <h3 className="font-semibold text-white text-sm">{model.name}</h3>
                <p className="text-xs text-[#94a3b8]">{model.library}</p>
              </div>

              {/* Layer */}
              <div className="text-xs bg-[#1a1d23] p-2 rounded border border-[#1f2937] text-[#e0e0e0]">
                {model.layer}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                {model.trained ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
                    <span className="text-xs text-[#00ff88] font-semibold">TRAINED</span>
                  </>
                ) : (
                  <span className="text-xs text-[#f59e0b] font-semibold">UNTRAINED</span>
                )}
              </div>

              {/* Train Button */}
              {model.trainable && (
                <Button
                  onClick={() => handleTrain(model.name)}
                  disabled={trainingModel === model.name}
                  size="sm"
                  className="w-full bg-[#f59e0b]/20 text-[#f59e0b] hover:bg-[#f59e0b]/30 border border-[#f59e0b]/50"
                >
                  {trainingModel === model.name ? (
                    <>
                      <Loader className="w-3 h-3 mr-2 animate-spin" />
                      {Math.round(trainingProgress)}%
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3 mr-2" />
                      Train
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Spending Forecast Section */}
      <Card className="bg-[#121418] border-[#1f2937] p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Spending Forecast</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#94a3b8] mb-2">Select Entity</label>
            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
              <SelectTrigger className="bg-[#1a1d23] border-[#1f2937]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#121418] border-[#1f2937]">
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="ministry_health">Ministry of Health</SelectItem>
                <SelectItem value="county_nairobi">County Government - Nairobi</SelectItem>
                <SelectItem value="county_kisumu">County Government - Kisumu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full bg-[#00ff88] text-black hover:bg-[#00ff88]/90">
            Run Forecast
          </Button>

          <div className="bg-[#1a1d23] p-4 rounded border border-[#1f2937] text-center text-[#94a3b8]">
            <p>Forecast visualization will appear here</p>
          </div>
        </div>
      </Card>

      {/* Model Performance */}
      <Card className="bg-[#121418] border-[#1f2937] p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Model Performance</h2>
        <div className="space-y-4">
          {models.filter((m) => m.trained).map((model) => (
            <div key={model.name}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white">{model.name}</span>
                <span className="text-sm font-mono text-[#00ff88]">
                  {85 + Math.random() * 10 |0}%
                </span>
              </div>
              <Progress
                value={85 + Math.random() * 10}
                className="h-2"
                indicatorClassName="bg-[#00ff88]"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
