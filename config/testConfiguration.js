import { getValueByComponent } from '../utils/ExcelReader';
const filePath = "./config/TestConfiguration.xlsx";
const sheetName = "Sheet1";
const browser = getValueByComponent(filePath, sheetName, 'AppBrowser');
const mode = getValueByComponent(filePath, sheetName, 'Headless');
const viewport = getValueByComponent(filePath, sheetName, 'Viewport size');
const timeout = getValueByComponent(filePath, sheetName, 'timeout');
const assertionTimeout = getValueByComponent(filePath, sheetName, 'expect timeout');
const parallel = getValueByComponent(filePath, sheetName, 'Parallel');
const workers = getValueByComponent(filePath, sheetName, 'Workers');
const senderMail = getValueByComponent(filePath, sheetName, 'Sender');
const password = getValueByComponent(filePath, sheetName, 'Password');
const recipients = getValueByComponent(filePath, sheetName, 'Receiver');
const mailTrigger = getValueByComponent(filePath, sheetName, 'Trigger');
const passScreenshot = getValueByComponent(filePath, sheetName, 'Pass_Screenshot');
export function browserName() {
    let appBrowser;

    switch (browser.toLowerCase()) {
        case 'chromium':
            appBrowser = 'chromium';
            break;
        case 'firefox':
            appBrowser = 'firefox';
            break;
        case 'webkit':
            appBrowser = 'webkit';
            break;
        default:
            console.error('No valid browser name found');
            appBrowser = null;
    }
    return appBrowser;
}

export function browserMode() {
    return mode.toLowerCase() === 'yes';
}

export function parallelMode() {
    return parallel.toLowerCase() === 'yes';
}

export function testTimeout() {

    return parseInt(timeout, 10);

}

export function expectTimeout() {

    return parseInt(assertionTimeout, 10);

}

export function numberOfWorkers() {

    return parseInt(workers, 10);

}

export function timestamp() {
    const timestamp = new Date();
    const shortDate = `${timestamp.getFullYear()}-${(timestamp.getMonth() + 1).toString().padStart(2, '0')}-${timestamp.getDate().toString().padStart(2, '0')}`;
    const shortTime = `${timestamp.getHours().toString().padStart(2, '0')}-${timestamp.getMinutes().toString().padStart(2, '0')}`;
    const formattedTimestamp = `${shortDate}_${shortTime}`;
    return formattedTimestamp;
}

export const mailConfig = {
    senderEmail: senderMail,
    password: password,
    receiver: recipients.split(',').map((email) => email.trim()),
    mail: mailTrigger,
    pass_screenshot: passScreenshot
}
