const fs = require('fs');
const archiver = require('archiver');
const nodemailer = require('nodemailer');
import { mailConfig } from '../config/testConfiguration'

export class Mail {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: mailConfig.senderEmail,
                pass: mailConfig.password
            },
            debug: false,
            logger: false
        });
    }

    async zipReportFolder(HtmlResultsDir) {
        return new Promise((resolve, reject) => {
            const output = fs.createWriteStream('./Test-report.zip');
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => resolve('./Test-report.zip'));
            archive.on('error', err => reject(err));

            archive.pipe(output);
            archive.directory(HtmlResultsDir, false); // Path to your report folder
            archive.finalize();
        });
    }

    generateTableHTML(testResults) {
        if (!Array.isArray(testResults) || testResults.length === 0) {
            return '<p>No test results available.</p>';
        }

        let totalExecuted = 0;
        let passedCount = 0;

        let detailsRows = '';

        testResults.forEach(spec => {
            if (spec.tests) {
                spec.tests.forEach(test => {
                    totalExecuted++;
                    const testName = test.title || 'Unnamed Test';
                    const status = test.results && test.results.status === 'passed' ? 'Passed' : 'Failed';
                    let failureReason = '-';

                    if (status === 'Failed' && test.results && test.results.error) {
                        failureReason = `${test.results.error.message} (Line ${test.results.error.lineNumber || 'unknown'})`;
                    } else if (status === 'Passed') {
                        passedCount++;
                    }

                    detailsRows += `
                        <tr>
                            <td>${testName}</td>
                            <td>${status}</td>
                            <td>${failureReason}</td>
                        </tr>
                    `;
                });
            }
        });

        const failedCount = totalExecuted - passedCount;

        return `
            <h4>Summary Table</h4>
            <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Testcase Name</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Total No of Executed</td>
                        <td>${totalExecuted}</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>No of Passed</td>
                        <td>${passedCount}</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>No of Failed</td>
                        <td>${failedCount}</td>
                    </tr>
                </tbody>
            </table>
    
            <h4>Detailed Test Results</h4>
            <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <th>Testcase Name</th>
                        <th>Status</th>
                        <th>Failure Reason</th>
                    </tr>
                </thead>
                <tbody>
                    ${detailsRows}
                </tbody>
            </table>
        `;
    }

    async sendMail(testResults, HtmlResultsDir) {
        if (!testResults || !testResults.specs) {
            console.error('Invalid test results provided:', testResults);
            return;
        }

        const emailBody = this.generateTableHTML(testResults.specs);

        try {
            const zipFilePath = await this.zipReportFolder(HtmlResultsDir);

            const mailOptions = {
                from: mailConfig.senderEmail,
                to: mailConfig.receiver,
                subject: 'Carepath -> Test Execution Results',
                html: `<h3>Test Execution Summary</h3>${emailBody}`,
                attachments: [
                    {
                        filename: 'Test-report.zip',
                        path: zipFilePath
                    }
                ]
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`Email sent: ${info.response}`);

            // Delete the zip file after sending the email
            fs.unlink(zipFilePath, (err) => {
                if (err) {
                    console.error(`Error deleting zip file: ${err.message}`);
                } else {
                    console.log('Zip file deleted successfully');
                }
            });
        } catch (error) {
            console.error(`Error sending email: ${error.message}`);
        }
    }
}
