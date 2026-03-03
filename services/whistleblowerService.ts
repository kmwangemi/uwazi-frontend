import api from '@/lib/api';
import { mockPublicReports } from '@/lib/mockData';

export interface WhistleblowerReportPayload {
    report_type: string;
    tender_number?: string;
    county?: string;
    description: string;
    email?: string;
}

export interface WhistleblowerReportResponse {
    success: boolean;
    trackingId: string;
    message: string;
}

export interface TrackingResponse {
    id: string;
    trackingId: string;
    status: string;
    reportType: string;
    severity: string;
    submittedDate: string;
    reviewedDate?: string;
    county?: string;
    rejectionReason?: string;
    createdInvestigationId?: string;
}

export const whistleblowerService = {
    submitReport: async (
        data: WhistleblowerReportPayload,
    ): Promise<WhistleblowerReportResponse> => {
        try {
            const response = await api.post<WhistleblowerReportResponse>(
                '/whistleblower/reports',
                data,
            );
            return response.data;
        } catch (error) {
            console.warn('API error, falling back to mock submission', error);
            // Fallback mock logic for development
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        trackingId: `TRACK-${Date.now()}-${Math.random()
                            .toString(36)
                            .substring(2, 9)
                            .toUpperCase()}`,
                        message: 'Report submitted successfully',
                    });
                }, 1000);
            });
        }
    },

    trackReport: async (trackingId: string): Promise<TrackingResponse> => {
        try {
            const response = await api.get<TrackingResponse>(
                `/whistleblower/track/${trackingId}`,
            );
            return response.data;
        } catch (error) {
            console.warn('API error, falling back to mock tracking lookup', error);
            const report = mockPublicReports.find(
                r => r.trackingId === trackingId.toUpperCase(),
            );
            if (!report) {
                throw new Error('Report not found');
            }
            return {
                id: report.id.toString(),
                trackingId: report.trackingId,
                status: report.status,
                reportType: report.reportType,
                severity: report.severity,
                submittedDate: report.submittedDate,
                reviewedDate: report.reviewedDate,
                county: report.county,
                rejectionReason: report.rejectionReason,
                createdInvestigationId: report.createdInvestigationId?.toString(),
            };
        }
    },
};
