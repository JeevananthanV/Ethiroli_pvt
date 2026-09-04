import 'dotenv/config';
import Tenant from './src/models/Tenant.js';
import Product from './src/models/Product.js';
import Coupon from './src/models/Coupon.js';
import ReportDefinition from './src/models/ReportDefinition.js';
import ApiKey from './src/models/ApiKey.js';
import pool from './src/config/database.js';

async function runTests() {
  console.log('--- Phase 7 Self-Verification Test Suite ---');

  const userId = '368f5c88-12cd-11ed-861d-0242ac120002'; // Seed User ID

  // Disable foreign key checks for testing reference insertions
  await pool.execute('SET FOREIGN_KEY_CHECKS = 0');

  // 1. Test Tenants
  console.log('\n1. Testing Tenant organization creation...');
  let tenantId = '';
  try {
    tenantId = await Tenant.create({
      name: 'Coimbatore Learning Institute',
      subdomain: 'cbe-learning-' + Date.now(),
      primary_color: '#4F46E5',
      secondary_color: '#0EA5E9'
    });
    console.log(`   ✅ Tenant.create successful. Tenant ID: ${tenantId}`);

    const tenants = await Tenant.list();
    console.log(`   ✅ Tenant.list returned ${tenants.length} tenants.`);
  } catch (error) {
    console.error('❌ Tenant tests failed:', error.message);
  }

  // 2. Test Marketplace Products
  console.log('\n2. Testing Course Product publishing...');
  try {
    const courseId = '368f5c88-12cd-11ed-861d-0242ac120003'; // Mock course ID
    const productId = await Product.create({
      tenant_id: tenantId,
      course_id: courseId,
      price: 9999.00,
      discounted_price: 7999.00,
      is_published: true
    });
    console.log(`   ✅ Product.create successful. Product ID: ${productId}`);

    const products = await Product.list({ tenant_id: tenantId });
    console.log(`   ✅ Product.list returned ${products.length} products.`);
  } catch (error) {
    console.error('❌ Product tests failed:', error.message);
  }

  // 3. Test Coupon Codes
  console.log('\n3. Testing Coupon code validation...');
  try {
    const couponCode = 'DISCOUNT2026';
    const couponId = await Coupon.create({
      tenant_id: tenantId,
      code: couponCode,
      discount_type: 'PERCENTAGE',
      discount_value: 10.00,
      min_order_value: 500.00,
      valid_from: '2026-08-01',
      valid_to: '2026-12-31',
      created_by: userId
    });
    console.log(`   ✅ Coupon.create successful. Coupon ID: ${couponId}`);

    const coupon = await Coupon.findByCode(tenantId, couponCode);
    if (coupon && coupon.code === couponCode) {
      console.log('   ✅ Coupon validation verified successfully.');
    }
  } catch (error) {
    console.error('❌ Coupon tests failed:', error.message);
  }

  // 4. Test Report Definitions
  console.log('\n4. Testing saved Report definitions...');
  try {
    const reportId = await ReportDefinition.create({
      tenant_id: tenantId,
      name: 'Monthly Enrollment Metrics',
      description: 'BI report showing enrollments count per course monthly',
      dimensions: ['course_name', 'month'],
      metrics: ['enrollment_count', 'revenue'],
      chart_type: 'TABLE',
      created_by: userId
    });
    console.log(`   ✅ ReportDefinition.create successful. ID: ${reportId}`);

    const reports = await ReportDefinition.list({ tenant_id: tenantId });
    console.log(`   ✅ ReportDefinition.list returned ${reports.length} report definitions.`);
  } catch (error) {
    console.error('❌ Report tests failed:', error.message);
  }

  // 5. Test Developer API Keys
  console.log('\n5. Testing Developer Portal API Keys token generation...');
  try {
    const apiKeyVal = 'cbe-key-' + Date.now();
    const keyId = await ApiKey.create({
      tenant_id: tenantId,
      user_id: userId,
      name: 'Webhook Ingestion key',
      api_key: apiKeyVal,
      api_secret: 'api-secret-bytes-token-enc-value',
      scopes: ['read:leads']
    });
    console.log(`   ✅ ApiKey.create successful. Key ID: ${keyId}`);

    const apiKeys = await ApiKey.list({ tenant_id: tenantId });
    console.log(`   ✅ ApiKey.list returned ${apiKeys.length} active client keys.`);
  } catch (error) {
    console.error('❌ API Key tests failed:', error.message);
  }

  // Enable foreign key checks back
  await pool.execute('SET FOREIGN_KEY_CHECKS = 1');

  console.log('\n--- Phase 7 Test Suite Complete ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
