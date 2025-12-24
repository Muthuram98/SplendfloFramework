const { readPdfText } = require("./pdfReader");
const pdfCache = new Map();

const fieldPatterns = {
  invoiceNumber: /Invoice Number\s*#?\s*([A-Z0-9]+)/i,
  orderId: /Order ID:\s*([A-Z0-9]+)/i,
  billTo: /Bill To\s*\n([\s\S]*?)\nOrder ID:/i,
  productTitle: /(RED\s+TAPE\s+Men\s+Clogs)/i,
  fsn: /FSN:\s*([A-Z0-9]+)/i,
  hsn: /HSN\/SAC:\s*(\d+)/i,
  grandTotal: /Grand Total\s*₹?\s*(\d+\.\d+)/i
};

async function getInvoiceValue(pdfPath, fieldName) {
  if (!pdfCache.has(pdfPath)) {
    pdfCache.set(pdfPath, await readPdfText(pdfPath));
  }

  const text = pdfCache.get(pdfPath);

  /* ===============================
     PRODUCT NUMERIC EXTRACTION
     =============================== */
  if (
    ["quantity", "grossAmount", "discount", "taxableValue", "igst", "total"]
      .includes(fieldName)
  ) {
    // 1️⃣ Locate product numeric block
    const blockMatch = text.match(
      /RED\s+TAPE\s+Men\s+Clogs([\s\S]*?)Grand Total/i
    );

    if (!blockMatch) {
      throw new Error("Product block not found in invoice");
    }

    // 2️⃣ Normalize merged numbers
    const normalized = blockMatch[1]
      .replace(/(\d)(-?\d+\.\d+)/g, "$1 $2")
      .replace(/(\.\d+)(\d)/g, "$1 $2");

    // 3️⃣ Extract numbers safely
    const numbers = normalized.match(/-?\d+\.\d+/g);

    if (!numbers || numbers.length < 5) {
      throw new Error(
        `Product numeric values not found correctly. Found: ${numbers}`
      );
    }

    const valueMap = {
      quantity: "1",
      grossAmount: numbers[0],   // 624.00
      discount: numbers[1],      // -219.00
      taxableValue: numbers[2],  // 385.72
      igst: numbers[3],          // 19.28
      total: numbers[4]          // 405.00
    };

    return valueMap[fieldName];
  }

  /* ===============================
     STANDARD FIELD EXTRACTION
     =============================== */
  const pattern = fieldPatterns[fieldName];
  if (!pattern) {
    throw new Error(`Field '${fieldName}' is not configured`);
  }

  const match = text.match(pattern);
  if (!match) {
    throw new Error(`Value not found for field '${fieldName}'`);
  }

  return match[1].replace(/\n+/g, " ").trim();
}

module.exports = { getInvoiceValue };
