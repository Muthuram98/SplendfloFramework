const { test, expect } = require("@playwright/test");
const { getInvoiceValue } = require("../utils/invoiceDataUtil");
const fs = require("fs");

export function pdftest() {

test("Read values from invoice PDF", async () => {
  const pdfPath = "C:/Users/muthu/Downloads/OD336223057563905100.pdf";

  console.log("PDF path:", pdfPath);
  console.log("PDF exists:", fs.existsSync(pdfPath));

  if (!fs.existsSync(pdfPath)) {
    throw new Error("PDF FILE NOT FOUND. Fix the path first.");
  }

  const invoiceNumber = await getInvoiceValue(pdfPath, "invoiceNumber");
  const orderId = await getInvoiceValue(pdfPath, "orderId");
  const billTo = await getInvoiceValue(pdfPath, "billTo");
  const grandTotal = await getInvoiceValue(pdfPath, "grandTotal");
  const productTitle = await getInvoiceValue(pdfPath, "productTitle");
  const fsn = await getInvoiceValue(pdfPath, "fsn");
  const hsn = await getInvoiceValue(pdfPath, "hsn");

  const quantity = await getInvoiceValue(pdfPath, "quantity");
  const grossAmount = await getInvoiceValue(pdfPath, "grossAmount");
  const discount = await getInvoiceValue(pdfPath, "discount");
  const taxableValue = await getInvoiceValue(pdfPath, "taxableValue");
  const igst = await getInvoiceValue(pdfPath, "igst");


  console.log("invoiceNumber: "+invoiceNumber);
  console.log("orderId: "+orderId);
  console.log("billTo: "+billTo);
  console.log("grandTotal: "+grandTotal);

  console.log("productTitle: "+productTitle);
  console.log("fsn: "+fsn);
  console.log("hsn: "+hsn);
  console.log("quantity: "+quantity);
  console.log("grossAmount: "+grossAmount);
  console.log("discount: "+discount);
  console.log("taxableValue: "+taxableValue);
  console.log("igst: "+igst);

  expect(orderId).toBe("OD336223057563905100");
  expect(grandTotal).toBe("405.00");
});

}
