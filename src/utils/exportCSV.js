const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

const exportToCSV = async (filePath, header, records) => {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header,
  });

  await csvWriter.writeRecords(records);
  return filePath;
};

module.exports = exportToCSV;
