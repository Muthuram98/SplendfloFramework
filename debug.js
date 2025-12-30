const Utils = require('./utils/ExcelReader.js');

async function debugData() {
  const TestdataPath = './testdata/Testdata.xlsx';
  const sheetName = 'Sheet1'; // assuming, change if needed
  const dataset = 'Dataset1'; // assuming, change if needed

  const data = await Utils.getAllTestData(TestdataPath, sheetName, dataset);
  console.log('Data:', data);
  console.log('workflowName:', data.workflowName);
}

debugData();