import { Mail } from "./config/mail.js";
import { mailConfig } from "./config/testConfiguration.js";
import fs from "fs";
import path from "path";

async function fetchTestResults() {
  try {
    const resultPath = path.join(process.cwd(), 'test-results.json');

    if (!fs.existsSync(resultPath)) {
      console.error('❌ test-results.json not found at:', resultPath);
      return null;
    }

    return JSON.parse(fs.readFileSync(resultPath, 'utf-8'));
  } catch (error) {
    console.error('Error reading test results:', error);
    return null;
  }
}


async function globalTeardown() {
  if (mailConfig.mail?.toLowerCase() !== "yes") {
    console.log("📭 Email sending is disabled in config.");
    return;
  }

  console.log("📧 Email trigger enabled");

  const testResults = await fetchTestResults();

  if (!testResults || !testResults.specs) {
    console.warn("⚠ No test results available to send.");
    return;
  }

  const mail = new Mail();
  await mail.sendMail(testResults, "./reports");

  console.log("✅ Email sent with test results");
}

export default globalTeardown;
