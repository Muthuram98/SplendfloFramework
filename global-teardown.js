import { Mail } from "./config/mail";
import { mailConfig } from "./config/testConfiguration";
import fs from "fs";

// Retrieve test results from a shared file or variable
async function fetchTestResults() {
  try {
    const rawData = fs.readFileSync("./test-results.json", "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading or parsing test-results.json:", error);
    return null;
  }
}

// Global Teardown Function
async function globalTeardown() {
  if (mailConfig.mail === "Yes") {
    const mail = new Mail();
    const testResults = await fetchTestResults();
    
    if (testResults) {
      await mail.sendMail(testResults);
      console.log("Email sent with test results.");
    } else {
      console.warn("No test results available to send.");
    }
  } else {
    console.log("Email sending is disabled in config.");
  }

  // Clean up test-results.json if it exists
  try {
    if (fs.existsSync('./test-results.json')) {
      fs.unlinkSync('./test-results.json');
      console.log('Cleaned up test-results.json');
    }
  } catch (error) {
    console.error("Error deleting test-results.json:", error);
  }
}

export default globalTeardown;
