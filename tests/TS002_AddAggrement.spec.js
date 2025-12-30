import { test } from '@playwright/test';
import { LoginPage } from '../pageobjects/SplendfloLogin.js';
import { SpendflowPage } from '../pageobjects/AgreementDetails.js';
import Utils from '../utils/ExcelReader.js';
import { PricingDetails } from '../pageobjects/PricingDetails.js';
import { PricingDetails2 } from '../pageobjects/PricingDetails2.js';
import { ExecutionRegistry } from '../utils/ExecutionRegistry.js';
import { TestContext } from '../utils/TestContext.js';
import { readExecutionSheet } from '../utils/ExcelReader.js';


// Increase timeout for CI & long UI flows
test.setTimeout(300000);

const TEST_ID = 'TS002_AddAggrement';

function parseDatasets(datasetStr) {
  if (!datasetStr) return [1]; // default
  const str = datasetStr.toString().trim();
  if (str.includes(',')) {
    return str.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  } else if (str.includes('-')) {
    const parts = str.split('-').map(s => parseInt(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const [start, end] = parts;
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
  }
  const num = parseInt(str);
  return isNaN(num) ? [1] : [num];
}

const executionData = readExecutionSheet('./testdata/TestExecution.xlsx', 'Sheet1');
const row = executionData.find(r => r.testCaseId === TEST_ID);

if (row && row.flag === 'Yes') {
  const datasets = parseDatasets(row.dataset);
  for (const datasetNumber of datasets) {
    test(`${TEST_ID} - Spendflo agreement addition using Excel data - Dataset${datasetNumber}`, async ({ page }) => {
      TestContext.environment = row.environment;
      TestContext.testDataFile = row.testDataFile;
      TestContext.sheetName = row.sheetName;
      TestContext.dataset = datasetNumber;

      const url = TestContext.environment;
      const TestdataPath = TestContext.testDataFile;
      const sheetName = TestContext.sheetName;
    const dataset = 'Dataset' + datasetNumber;


    /* =========================
       READ EXCEL DATA ONCE
    ========================== */
    const data = await Utils.getAllTestData(TestdataPath, sheetName, dataset);
    data.Url = url; // Override with environment URL

    /* =========================
       LOGIN
    ========================== */
    const loginPage = new LoginPage(page);
    await loginPage.navigate(data.Url);
    await loginPage.login(data.Username, data.Password);

    /* =========================
       AGREEMENT CREATION
    ========================== */
    const spendflowPage = new SpendflowPage(page);

    await spendflowPage.navigateToAgreements();

    await spendflowPage.addAgreement(data.AgreementFilePath);

    await spendflowPage.verifyVendorName(data.VendorName,data.NewVendorName);

    await spendflowPage.clickSaveAndContinue();

    /* =========================
       AGREEMENT VERIFICATION
    ========================== */
    await spendflowPage.verifyAgreementDetailsText(
      data.AgreementDetailsText
    );

    await spendflowPage.verifyAgreementStartDate(
      data.AgreementStartDate,data.NewAgreementStartDate
    );

    await spendflowPage.verifyAgreementEndDate(
      data.AgreementEndDate,data.NewAgreementEndDate
    );

    await spendflowPage.verifyFirstQuote(data.FirstQuote,data.NewFirstQuote);

    await spendflowPage.verifyContractedValue(data.ContractedValue,data.NewContractedValue);

    await spendflowPage.verifyAgreementDuration(
      data.AgreementDuration, data.NewAgreementDuration
    );

    await spendflowPage.verifyProcuredBySpendflo(
      data.ProcuredBySpendflo, data.NewProcuredBySpendflo
    );

    await spendflowPage.verifyPaymentTerm(
      data.PaymentTerms, data.NewPaymentTerms
    );

    await spendflowPage.verifyBillingFrequency(data.BillingFrequency, data.NewBillingFrequency);

    await spendflowPage.verifyAgreementOwner(data.AgreementOwner, data.NewAgreementOwner);

    await spendflowPage.verifyAutorenew(data.AutoRenew, data.NewAutoRenew);


    // /* =========================
    //    PRICING DETAILS VERIFICATION
    // ========================== */
    
    const pricingDetailsVerification = new PricingDetails(page);

    await pricingDetailsVerification.verifyLineItemType(data.LineItemType, data.NewLineItemType);

    await pricingDetailsVerification.verifyOfferingName(data.OfferingName,data.NewOfferingName);

    await pricingDetailsVerification.verifyPlan(data.Plan,data.NewPlan);

    await pricingDetailsVerification.verifyPricingModel(
      data.PricingModel, data.NewPricingModel
    );

    await pricingDetailsVerification.verifyStartDate(
      data.PricingStartDate, data.NewPricingStartDate
    );

    await pricingDetailsVerification.verifyEndDate(
      data.PricingEndDate, data.NewPricingEndDate
    );

    await pricingDetailsVerification.verifyQuantity(data.Quantity, data.NewQuantity);

    await pricingDetailsVerification.verifyUnitOfMeasure(
      data.UnitOfMeasure, data.NewUnitOfMeasure
    );

    await pricingDetailsVerification.verifyCost(data.CostPerUnit, data.NewCostPerUnit);

    await pricingDetailsVerification.verifyEstimatedUsage(
      data.EstimatedUsage, data.NewEstimatedUsage
    );

    await pricingDetailsVerification.verifyAmount(data.Amount, data.NewAmount);   


    //PricingDetails 2 Verification

    const pricingDetails2Verification = new PricingDetails2(page);

    await pricingDetails2Verification.openLineItemSection();

    await pricingDetails2Verification.verifyLineItemType(data.LineItemType, data.NewLineItemType);

    await pricingDetails2Verification.verifyOfferingName(data.OfferingName,data.NewOfferingName);

    await pricingDetails2Verification.verifyPlan(data.Plan,data.NewPlan);

    await pricingDetails2Verification.verifyPricingModel(
      data.PricingModel, data.NewPricingModel
    );

    await pricingDetails2Verification.verifyStartDate(
      data.PricingStartDate, data.NewPricingStartDate
    );

    await pricingDetails2Verification.verifyEndDate(
      data.PricingEndDate, data.NewPricingEndDate
    );

    await pricingDetails2Verification.verifyQuantity(data.Quantity, data.NewQuantity);

    await pricingDetails2Verification.verifyUnitOfMeasure(
      data.UnitOfMeasure, data.NewUnitOfMeasure
    );

    await pricingDetails2Verification.verifyCost(data.CostPerUnit, data.NewCostPerUnit);

    await pricingDetails2Verification.verifyEstimatedUsage(
      data.EstimatedUsage, data.NewEstimatedUsage
    );

    await pricingDetails2Verification.verifyAmount(data.Amount, data.NewAmount);   

    await pricingDetails2Verification.clickSaveAndContinue();

    await pricingDetails2Verification.verifyConfirmationPopup(data.ExpectedPopup);

  });
}
}
