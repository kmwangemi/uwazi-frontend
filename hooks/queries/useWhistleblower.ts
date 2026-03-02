import { useMutation, useQuery } from '@tanstack/react-query';
import {
    whistleblowerService,
    WhistleblowerReportPayload,
} from '@/services/whistleblowerService';

export const whistleblowerKeys = {
    all: ['whistleblower'] as const,
    tracks: () => [...whistleblowerKeys.all, 'track'] as const,
    track: (id: string) => [...whistleblowerKeys.tracks(), id] as const,
};

export function useSubmitReport() {
    return useMutation({
        mutationFn: (data: WhistleblowerReportPayload) =>
            whistleblowerService.submitReport(data),
    });
}

export function useTrackReport(trackingId: string) {
    return useQuery({
        queryKey: whistleblowerKeys.track(trackingId),
        queryFn: () => whistleblowerService.trackReport(trackingId),
        enabled: !!trackingId,
        retry: false, // Don't retry endlessly if the tracking ID is invalid/not found
    });
}
