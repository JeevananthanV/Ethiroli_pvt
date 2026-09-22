import 'dotenv/config';
import Transaction from '../src/models/Transaction.js';
import Invoice from '../src/models/Invoice.js';
import ForumPost from '../src/models/ForumPost.js';
import Badge from '../src/models/Badge.js';
import pool from '../src/config/database.js';

async function runTests() {
  console.log('--- Phase 3 Self-Verification Test Suite ---');

  const userId = '368f5c88-12cd-11ed-861d-0242ac120002'; // Seed Admin ID

  // 1. Test Finance Invoices & Transactions
  console.log('\n1. Testing Invoice generation & Transaction log...');
  try {
    const invoiceNumber = 'INV-' + Date.now();
    const invoiceId = await Invoice.create({
      invoice_number: invoiceNumber,
      issue_date: new Date(),
      due_date: new Date(Date.now() + 864000000), // 10 days out
      subtotal: 1000.00,
      gst_rate: 18.00,
      gst_amount: 180.00,
      total: 1180.00,
      created_by: userId
    });
    console.log(`   ✅ Invoice.create successful. Invoice ID: ${invoiceId}`);

    await Transaction.create({
      type: 'INCOME',
      category: 'Course Fee',
      amount: 1180.00,
      date: new Date(),
      invoice_id: invoiceId,
      created_by: userId
    });
    console.log('   ✅ Income Transaction logged successfully.');
  } catch (error) {
    console.error('❌ Finance tests failed:', error.message);
  }

  // 2. Test Forums
  console.log('\n2. Testing Forums postings...');
  try {
    // Seed a mock course first
    const [result] = await pool.execute(
      "INSERT INTO courses (id, code, name, duration_days) VALUES ('mock-c-1', 'C-1', 'Mock Course', 5) ON DUPLICATE KEY UPDATE id=id"
    );

    await ForumPost.create({
      course_id: 'mock-c-1',
      author_id: userId,
      title: 'How does live socket state sync work?',
      content: 'I noticed state synchronizes automatically across HR role dashboards.'
    });
    console.log('   ✅ ForumPost.create successful.');

    const posts = await ForumPost.list({ course_id: 'mock-c-1' });
    console.log(`   ✅ ForumPost.list returned ${posts.length} discussions.`);
  } catch (error) {
    console.error('❌ Forum tests failed:', error.message);
  }

  // 3. Test Gamification Badges
  console.log('\n3. Testing Gamification badges criteria seed...');
  try {
    await Badge.create({
      name: 'Quiz Master ' + Date.now(),
      description: 'Score 90%+ on any quiz session.',
      icon: 'fa-trophy',
      criteria: { type: 'quiz_score', threshold: 90 }
    });
    console.log('   ✅ Badge.create successful.');

    const activeBadges = await Badge.list();
    console.log(`   ✅ Badge.list returned ${activeBadges.length} active achievements.`);
    for (const badge of activeBadges) {
      console.log('   -', badge.name, 'criteria:', JSON.stringify(badge.criteria));
    }
  } catch (error) {
    console.error('❌ Badge tests failed:', error.message);
    console.error(error.stack);
  }

  console.log('\n--- Phase 3 Test Suite Complete ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
