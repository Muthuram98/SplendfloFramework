const fs = require("fs");
const pdfParse = require("pdf-parse");

async function readPdfText(pdfPath) {

  console.log("✅ pdfReader.js LOADED FROM:", __filename);

  const buffer = fs.readFileSync(pdfPath);

  const data = await pdfParse(buffer);
  return data.text.replace(/\r/g, "").trim();
}

module.exports = { readPdfText };
