export function exportToCSV(filename, headers, data) {
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add data
  data.forEach(row => {
    const values = headers.map(header => {
      const val = row[header];
      if (typeof val === 'object') return JSON.stringify(val);
      return `"${(val ?? '').toString().replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
