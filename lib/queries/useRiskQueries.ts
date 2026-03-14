import { riskService } from '@/lib/services/riskService';
import { PriceCheckRequest } from '@/lib/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const riskKeys = {
  all: ['risk'] as const,
  countyOverview: () => [...riskKeys.all, 'county-overview'] as const,
};

export const useCountyRiskOverview = () =>
  useQuery({
    queryKey: riskKeys.countyOverview(),
    queryFn: riskService.getCountyRiskOverview,
  });

// ✅ Mutations for on-demand analysis — not queries since they require user input
export const useCheckPrice = () =>
  useMutation({
    mutationFn: (req: PriceCheckRequest) => riskService.checkPrice(req),
  });

export const useAnalyzeSpecifications = () =>
  useMutation({
    mutationFn: (text: string) => riskService.analyzeSpecifications(text),
  });
