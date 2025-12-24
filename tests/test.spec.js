import { test } from '@playwright/test';
import { pdftest } from '../e2e/invoice.spec.js';


test.describe('Test suite',()=>{

    pdftest();
}
);

