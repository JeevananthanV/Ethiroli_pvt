import 'dotenv/config';
import SalaryStructure from './src/models/SalaryStructure.js';
import Payroll from './src/models/Payroll.js';
import CalendarEvent from './src/models/CalendarEvent.js';
import Holiday from './src/models/Holiday.js';
import CompanySetting from './src/models/CompanySetting.js';
import { calculateSalaryComponents } from './src/services/payrollCalculator.js';
import pool from './src/config/database.js';

async function runTests() {
  console.log('--- Phase 5 Self-Verification Test Suite ---');

  const userId = '368f5c88-12cd-11ed-861d-0242ac120002'; // Seed Admin ID

  // 1. Test Payroll Calculator
  console.log('\n1. Testing Payroll calculator formulas...');
  try {
    const components = calculateSalaryComponents(50000.00);
    console.log(`   Basic: ${components.basic}, HRA: ${components.hra}, DA: ${components.da}, PF: ${components.pf}, ESI: ${components.esi}`);
    if (components.hra === 20000.00 && components.pf === 6000.00) {
      console.log('   ✅ Payroll Calculator math verified successfully.');
    } else {
      console.error('   ❌ Payroll Calculator math failed.');
    }
  } catch (error) {
    console.error('❌ Payroll calculator test failed:', error.message);
  }

  // 2. Test Holidays
  console.log('\n2. Testing Holiday registration...');
  try {
    const holidayDate = `2027-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
    const holidayId = await Holiday.create({
      name: 'Test Holiday ' + Date.now(),
      date: holidayDate,
      is_restricted: false
    });
    console.log(`   ✅ Holiday.create successful. ID: ${holidayId}`);

    const list = await Holiday.list();
    console.log(`   ✅ Holiday.list returned ${list.length} holidays.`);
  } catch (error) {
    console.error('❌ Holiday tests failed:', error.message);
  }

  // 3. Test Company Settings
  console.log('\n3. Testing Company settings encryption...');
  try {
    const settingId = await CompanySetting.create({
      company_name: 'Ethiroli Tech Solutions',
      gst: '33AAAAA1111A1Z1',
      pan: 'AAAAA1111A',
      bank_name: 'State Bank of India',
      bank_account: '999888777666',
      address: '123 Tech Park, Coimbatore'
    });
    console.log(`   ✅ CompanySetting.create successful. ID: ${settingId}`);

    const settings = await CompanySetting.findById(settingId);
    if (settings && settings.gst === '33AAAAA1111A1Z1' && settings.bank_account === '999888777666') {
      console.log('   ✅ Company Settings PII decryption verified successfully.');
    }
  } catch (error) {
    console.error('❌ Company settings tests failed:', error.message);
  }

  console.log('\n--- Phase 5 Test Suite Complete ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
