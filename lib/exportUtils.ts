export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  let csv = headers.join(',') + '\n';

  data.forEach(row => {
    csv +=
      headers
        .map(header => {
          const value = row[header];
          if (
            typeof value === 'string' &&
            (value.includes(',') || value.includes('"'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',') + '\n';
  });

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}

export function exportToJSON(data: any[], filename: string) {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.json`;
  link.click();
}

export function downloadPDF(filename: string, content: string) {
  // This is a simple implementation - for production, use libraries like jsPDF or React-PDF
  const blob = new Blob([content], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.pdf`;
  link.click();
}

export function shareData(title: string, text: string, url?: string) {
  if (navigator.share) {
    navigator
      .share({
        title,
        text,
        url,
      })
      .catch(err => console.log('Error sharing:', err));
  } else {
    // Fallback: copy to clipboard
    const shareText = `${title}\n${text}\n${url || ''}`;
    navigator.clipboard.writeText(shareText).then(() => {
      console.log('Copied to clipboard');
    });
  }
}
