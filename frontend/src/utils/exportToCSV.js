export const exportToCSV = (filename, data) => {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  data.forEach((row) => {
    const values = headers.map((header) => `"${row[header] || ""}"`);
    csvRows.push(values.join(","));
  });

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "export.csv";
  link.click();
  URL.revokeObjectURL(url);
};
