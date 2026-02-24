const fs = require("fs");
const csv = require("csv-parser");
const XLSX = require("xlsx");

exports.parseFile = (filePath) => {
  return new Promise((resolve, reject) => {

    // CSV
    if (filePath.endsWith(".csv")) {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", reject);
    }

    // Excel
    else {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);
      resolve(data);
    }

  });
};