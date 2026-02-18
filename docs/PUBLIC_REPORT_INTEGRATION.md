# Public Report Intake Integration Guide

## Overview

This document outlines how public reports (whistleblower submissions) are integrated into the investigations module of the procurement transparency system.

## System Architecture

### 1. Public Reporting Portal
- **Location**: `/whistleblower` (public route)
- **Form**: Collects anonymously submitted corruption reports
- **Data Generation**: Automatic tracking ID generation (TRACK-{timestamp}-{random})
- **Features**:
  - Anonymous submission option
  - Secure form validation
  - Tracking ID provision
  - Legal protection information

### 2. Report Tracking Portal
- **Location**: `/whistleblower/track` (public route)
- **Purpose**: Allows whistleblowers to check report status
- **Status Display**:
  - Pending → Under Review → Approved/Rejected/Converted
  - Visual progress indicators
  - Update notifications

### 3. Investigations Module - Pending Reports
- **Location**: `/investigations/pending-reports` (admin/protected route)
- **Purpose**: Internal review and workflow management
- **Features**:
  - Filter by status, severity, and search
  - Tab-based organization (Pending, Under Review, Approved, Rejected, Converted)
  - Batch action capabilities
  - Report statistics dashboard

### 4. Main Investigations Dashboard
- **Location**: `/investigations` (admin/protected route)
- **New Feature**: Pending reports alert card
- **Quick Link**: "Pending Reports" button with count
- **Alerts**: Shows notifications for reports awaiting action

## Report Lifecycle

```
Public Submission
    ↓
Generate Tracking ID
    ↓
Store in Database (Status: Pending)
    ↓
Investigator Reviews
    ↓
    ├─ Approve → Convert to Investigation (Status: Approved)
    ├─ Reject → Send Rejection Reason (Status: Rejected)
    └─ Under Review → Keep Pending (Status: Under Review)
    ↓
Admin Assigns Investigator
    ↓
Create Investigation Case (Status: Converted to Investigation)
    ↓
Link to Tender/Supplier (if applicable)
    ↓
Investigation Team Takes Over
```

## Data Models

### PublicReport Type
```typescript
interface PublicReport {
  id: string
  trackingId: string                    // Unique tracking identifier
  reportType: ReportType                // Fraud, Corruption, Irregularity, etc.
  title?: string                        // Optional report title
  description: string                   // Detailed report description
  county: string                        // Kenyan county
  entity?: string                       // Procuring entity name
  submittedDate: string                 // ISO timestamp
  submitterEmail?: string               // Optional contact email
  submitterPhone?: string               // Optional contact phone
  attachments?: string[]                // File references
  status: ReportStatus                  // Current status
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  relatedTenderId?: number              // Link to tender if known
  relatedSupplierId?: number            // Link to supplier if known
  anonymous: boolean                    // Anonymity flag
  notes?: string                        // Internal notes
  createdInvestigationId?: number       // Link to created investigation
  reviewedBy?: string                   // Reviewer name
  reviewedDate?: string                 // Review timestamp
  rejectionReason?: string              // If rejected, reason provided
}
```

## Integration Points

### 1. Whistleblower Form → Report Storage
```
User fills form at /whistleblower
↓
Form validation (Zod schema)
↓
Generate Tracking ID
↓
Create PublicReport object
↓
Store in database
↓
Return Tracking ID to user
↓
User can track at /whistleblower/track
```

### 2. Pending Reports → Investigation Creation
```
Admin views /investigations/pending-reports
↓
Reviews report details
↓
Clicks "Approve" button
↓
Update report status to "Approved"
↓
Can optionally create investigation immediately
↓
Or update to "Converted to Investigation" after investigation case created
```

### 3. Investigation Dashboard Integration
```
/investigations page
↓
Queries mockPublicReports for pending reports
↓
If pending reports exist:
  - Shows alert card with count
  - Provides "Review Reports" button
  - Links to /investigations/pending-reports
↓
Investigators can take immediate action
```

## Key Features

### Severity Levels
- **Critical**: Demands immediate attention (fraud, embezzlement)
- **High**: Significant concerns (bribery, major irregularities)
- **Medium**: Moderate issues requiring investigation
- **Low**: Minor concerns or complaints

### Report Status Flow
1. **Pending**: Initial submission awaiting first review
2. **Under Review**: Active investigation by review team
3. **Approved**: Verified and ready for investigation
4. **Rejected**: Insufficient evidence or false report
5. **Converted to Investigation**: Formal case created

### Search & Filter Capabilities
- Search by: title, description, tracking ID
- Filter by: status, severity, county
- Tab-based views for each status category
- Real-time statistics

## Admin Workflow

### Step 1: Review New Reports
```
1. Navigate to /investigations/pending-reports
2. View "Pending" tab for new submissions
3. Click "Expand" to view full details
4. Review description, severity, and supporting evidence
```

### Step 2: Take Action
```
Option A - Approve:
  1. Click "Approve" button
  2. Review will automatically be set to "Approved"
  3. Can proceed to create investigation case
  
Option B - Reject:
  1. Click "Reject" button
  2. Provide rejection reason
  3. Status updates to "Rejected"
  4. Reason stored for records

Option C - Further Review:
  1. Move report to "Under Review" tab
  2. Assign notes for investigation team
  3. Mark as reviewed but pending decision
```

### Step 3: Convert to Investigation
```
1. After approval, create investigation case
2. Link the public report to investigation
3. Update report status to "Converted to Investigation"
4. Assign investigator
5. Set priority level
6. Investigation team takes ownership
```

## Public-Facing Features

### Submission Portal
- Anonymous reporting option
- Multi-language support
- Encryption of submissions
- Clear legal protections displayed
- Accessibility compliance

### Tracking Portal
- Enter tracking ID to check status
- View progress through review stages
- Receive updates on decision
- See investigation case number (if converted)
- Contact support option

## Security Considerations

1. **Anonymity Protection**
   - No IP logging
   - Encrypted storage
   - Secure transmission (HTTPS)
   - Anonymous flag preserved throughout system

2. **Access Control**
   - Pending reports only visible to authenticated admin users
   - Role-based access (investigators, supervisors, admins)
   - Audit trail of all actions
   - User authentication required for /investigations routes

3. **Data Protection**
   - PII handling in compliance with GDPR/PDPA
   - Encryption at rest and in transit
   - Regular backups
   - Access logs for compliance

## Database Considerations

### Required Tables
```sql
CREATE TABLE public_reports (
  id UUID PRIMARY KEY,
  tracking_id VARCHAR(255) UNIQUE,
  report_type VARCHAR(100),
  title VARCHAR(500),
  description TEXT,
  county VARCHAR(100),
  entity VARCHAR(255),
  submitted_date TIMESTAMP,
  submitter_email VARCHAR(255),
  submitter_phone VARCHAR(20),
  status VARCHAR(50),
  severity VARCHAR(20),
  related_tender_id INT,
  related_supplier_id INT,
  anonymous BOOLEAN,
  notes TEXT,
  created_investigation_id INT,
  reviewed_by VARCHAR(255),
  reviewed_date TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tracking_id ON public_reports(tracking_id);
CREATE INDEX idx_status ON public_reports(status);
CREATE INDEX idx_submitted_date ON public_reports(submitted_date);
CREATE INDEX idx_severity ON public_reports(severity);
```

## Future Enhancements

1. **Email Notifications**
   - Notify submitter when status changes
   - Digest reports for investigators
   - Alert admins of critical reports

2. **Document Upload**
   - Support for evidence files
   - Scan for malware
   - Encrypted storage

3. **Advanced Analytics**
   - Report trends by county
   - Entity risk scoring based on reports
   - Fraud pattern detection

4. **Auto-Classification**
   - ML-based report categorization
   - Automatic severity assignment
   - Related tender/supplier identification

5. **Multi-Channel Submission**
   - Email submission support
   - SMS reporting option
   - Voice call integration

6. **Export & Reporting**
   - Generate reports on submissions
   - Statistical analysis
   - Investigation conversion rates

## Testing the System

### Manual Testing Workflow
```
1. Visit /whistleblower
2. Fill out form with test data
3. Submit anonymously
4. Note tracking ID
5. Visit /whistleblower/track
6. Enter tracking ID
7. Verify status displays correctly
8. Login as admin
9. Visit /investigations/pending-reports
10. View pending reports
11. Test approve/reject workflow
12. Verify status updates in tracking portal
```

### Sample Test Data
Mock data is provided in `lib/mockData.ts` under `mockPublicReports` array with various statuses and severities for testing.

## Support & Maintenance

### Common Issues
- **Tracking ID not found**: Verify exact spelling and format
- **Report lost**: Check if rejected in /investigations/pending-reports
- **Status not updating**: Refresh page or check browser cache

### Admin Support
- Contact: investigations@procurement.gov
- Reports per week: Monitor from pending reports dashboard
- Response time SLA: 2-3 business days

## Conclusion

This integration provides a complete whistleblower reporting system that seamlessly connects public submissions to the internal investigations workflow, ensuring transparency and enabling rapid response to procurement fraud allegations.
