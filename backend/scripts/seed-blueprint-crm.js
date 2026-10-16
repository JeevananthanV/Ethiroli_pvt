import pool from '../src/config/database.js';
import crypto from 'crypto';
import { encrypt, encryptDeterministic } from '../src/config/encryption.js';

const MATHISHREE_ID = 'eadd2eb6-b0af-4e3f-aa82-a08e29d891ee';
const NANDHINI_ID = '66da1638-9a06-4741-9ed2-8054b0417313';

async function seedBlueprint() {
  console.log('Seeding 100 BDA Dental Leads with Blueprint Schema, Deals, and Commissions...');

  // 1. Fetch all existing leads
  const [existingLeads] = await pool.query('SELECT id, company_name, first_name, assigned_to, notes FROM leads ORDER BY created_at ASC');
  console.log(`Found ${existingLeads.length} existing leads in DB.`);

  const packages = [
    { name: 'Essential Growth (₹25,000/mo)', tier: 'Essential Growth', price: 25000 },
    { name: 'Scale & Optimize (₹55,000/mo)', tier: 'Scale & Optimize', price: 55000 },
    { name: 'Enterprise Automation (₹1,20,000/mo)', tier: 'Enterprise Automation', price: 120000 },
    { name: 'Advanced UI/UX & Web Development (₹75,000 setup)', tier: 'Add-on: Web Portal', price: 75000 },
    { name: 'Reels & Video Production Pack (₹30,000/bundle)', tier: 'Add-on: Reels Pack', price: 30000 },
    { name: 'AI Workflow Automation (₹20,000 one-time)', tier: 'Add-on: AI Automation', price: 20000 }
  ];

  const stages = [
    { stage: 'Stage 1: Lead Ingestion & Qualification Discovery', status: 'NEW', action: 'Initiate 15-minute SLA WhatsApp/call sequence to verify primary MD decision-maker.' },
    { stage: 'Stage 2: Strategic Discovery & Consultation Demo', status: 'DEMO', action: 'Execute discovery meeting & audit Google Maps (GEO) + SEO footprint with custom demo.' },
    { stage: 'Stage 3: Solution Scoping & Proposal Architecture', status: 'COUNSELLING', action: 'Generate commercial PDF proposal and lock quoted package configuration.' },
    { stage: 'Stage 4: Contract Finalization & Closing Commitment', status: 'PAYMENT', action: 'Finalize multi-month retainer terms and dispatch automated digital sign link.' },
    { stage: 'Closed-Won (Onboarding Realization)', status: 'ADMISSION', action: 'Handover to Solutions Engineer & CSM for Phase 1 Alignment Audit.' },
    { stage: 'Closed-Lost (60-Day Nurture Loop)', status: 'LOST', action: 'Auto-enrolled into 60-day asynchronous case study drip sequence.' }
  ];

  const interestLevels = ['HOT', 'WARM', 'HOT', 'WARM', 'COLD'];

  // Update every lead with 17 Blueprint fields
  let idx = 1;
  for (const lead of existingLeads) {
    const leadCode = `ETH-2026-${String(idx).padStart(3, '0')}`;
    const pkg = packages[(idx - 1) % packages.length];
    const stg = stages[(idx - 1) % stages.length];
    const interest = interestLevels[(idx - 1) % interestLevels.length];

    // Determine district from existing notes
    let district = 'Erode';
    if (lead.notes) {
      const match = lead.notes.match(/District \/ Area:\s*([^|]+)/i) || lead.notes.match(/District:\s*([^|]+)/i);
      if (match) district = match[1].trim();
    }

    const bdaName = lead.assigned_to === MATHISHREE_ID ? 'Mathishree S' : 'Nandhini K';
    const cleanNotes = `District / Area: ${district} | BDA: ${bdaName} | Package: ${pkg.name}`;

    await pool.query(
      `UPDATE leads 
       SET lead_code = ?,
           district = ?,
           service_interested = ?,
           package_tier = ?,
           quoted_amount = ?,
           interest_level = ?,
           pipeline_stage = ?,
           status = ?,
           first_contact_date = '2026-10-10',
           last_contact_date = '2026-10-15',
           follow_up_date = '2026-10-22',
           meeting_date = '2026-10-20 11:30:00',
           next_action = ?,
           notes = ?
       WHERE id = ?`,
      [
        leadCode,
        district,
        pkg.name,
        pkg.tier,
        pkg.price,
        interest,
        stg.stage,
        stg.status,
        stg.action,
        cleanNotes,
        lead.id
      ]
    );
    idx++;
  }
  console.log(`Updated all 100 leads with 17-field Blueprint CRM data.`);

  // Clear existing dummy deals & commissions
  await pool.query('DELETE FROM sales_commissions');
  await pool.query('DELETE FROM sales_deals');
  await pool.query('DELETE FROM sales_targets');
  console.log('Cleared existing deal and commission tables.');

  // Create Deals and Commissions for Mathishree S
  const mathiDeals = [
    {
      title: 'Sri Saai Dental Clinic - Scale & Optimize Dental Package',
      clinic: 'Sri Saai Dental Clinic',
      contact: 'Dr. N. Srinivasan',
      phone: '7397556911',
      dealValue: 55000,
      stage: 'CLOSED_WON',
      commissionAmount: 5500,
      commissionStatus: 'Paid',
      category: 'Scale & Optimize'
    },
    {
      title: "Sree's Smile Care Dental Clinic - Essential Growth Package",
      clinic: "Sree's Smile Care Dental Clinic",
      contact: 'Dr. Pradeep',
      phone: '8523990979',
      dealValue: 25000,
      stage: 'CLOSED_WON',
      commissionAmount: 2500,
      commissionStatus: 'Approved',
      category: 'Essential Growth'
    },
    {
      title: 'G-Dent Dental Clinic - Enterprise Automation & AI Suite',
      clinic: 'G-Dent Dental Clinic',
      contact: 'Dr. Divakar',
      phone: '8973050555',
      dealValue: 120000,
      stage: 'CLOSED_WON',
      commissionAmount: 12000,
      commissionStatus: 'Payable',
      category: 'Enterprise Automation'
    },
    {
      title: 'Jayanthi Dental Clinic - Bespoke React Medical Portal & Reels',
      clinic: 'Jayanthi Dental Clinic',
      contact: 'Dr. S. Jegan',
      phone: '9994957603',
      dealValue: 105000,
      stage: 'CLOSED_WON',
      commissionAmount: 10500,
      commissionStatus: 'Pending Approval',
      category: 'Advanced UI/UX & Web Development'
    },
    {
      title: 'Care 24 Hospital - Scale & Optimize Performance Ads',
      clinic: 'Care 24 Hospital',
      contact: 'Dr. S.N. Neelavathi',
      phone: '9597222666',
      dealValue: 55000,
      stage: 'NEGOTIATION',
      category: 'Scale & Optimize'
    },
    {
      title: 'Muthuvel Dental Clinic - AI Patient Workflow Automation',
      clinic: 'Muthuvel Dental Clinic',
      contact: 'Dr. Aruleeswaran',
      phone: '9842725602',
      dealValue: 20000,
      stage: 'PROPOSAL_SENT',
      category: 'AI Workflow Automation'
    }
  ];

  for (const item of mathiDeals) {
    const dealId = crypto.randomUUID();
    await pool.query(
      `INSERT INTO sales_deals 
       (id, title, client_id, lead_id, contact_name, contact_email, contact_phone, deal_value, currency, stage, probability, expected_close_date, actual_close_date, owner_id, notes, created_at, updated_at)
       VALUES (?, ?, NULL, NULL, ?, ?, ?, ?, 'INR', ?, ?, '2026-10-31', ?, ?, ?, NOW(), NOW())`,
      [
        dealId,
        item.title,
        item.contact,
        'doctor@dentalcare.in',
        item.phone,
        item.dealValue,
        item.stage,
        item.stage === 'CLOSED_WON' ? 100 : 70,
        item.stage === 'CLOSED_WON' ? '2026-10-15' : null,
        MATHISHREE_ID,
        `BDA: Mathishree S | Category: ${item.category} | Clinic: ${item.clinic}`
      ]
    );

    if (item.stage === 'CLOSED_WON') {
      const commId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO sales_commissions
         (id, deal_id, bda_user_id, eligible_amount, commission_rate, commission_amount, status, approved_at, paid_at, payment_reference, created_at, updated_at)
         VALUES (?, ?, ?, ?, 10.00, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          commId,
          dealId,
          MATHISHREE_ID,
          item.dealValue,
          item.commissionAmount,
          item.commissionStatus,
          item.commissionStatus === 'Approved' || item.commissionStatus === 'Payable' || item.commissionStatus === 'Paid' ? new Date() : null,
          item.commissionStatus === 'Paid' ? new Date() : null,
          item.commissionStatus === 'Paid' ? `TXN-ETH-${Math.floor(100000 + Math.random() * 900000)}` : null
        ]
      );
    }
  }

  // Create Deals and Commissions for Nandhini K
  const nandhiniDeals = [
    {
      title: 'Vanjee Multispeciality Dental - Enterprise Automation & CRM Suite',
      clinic: 'Vanjee Multispeciality Dental',
      contact: 'Dr. Senthil Kumar',
      phone: '9952412697',
      dealValue: 120000,
      stage: 'CLOSED_WON',
      commissionAmount: 12000,
      commissionStatus: 'Paid',
      category: 'Enterprise Automation'
    },
    {
      title: 'Balaji Dental Hospital - Scale & Optimize Performance Ads',
      clinic: 'Balaji Dental Hospital',
      contact: 'Dr. Hari Prasath',
      phone: '6383115141',
      dealValue: 55000,
      stage: 'CLOSED_WON',
      commissionAmount: 5500,
      commissionStatus: 'Paid',
      category: 'Scale & Optimize'
    },
    {
      title: 'iTooth Dental Clinic - Essential Growth Dental Package',
      clinic: 'iTooth Dental Clinic',
      contact: 'Dr. Initha',
      phone: '7299400446',
      dealValue: 25000,
      stage: 'CLOSED_WON',
      commissionAmount: 2500,
      commissionStatus: 'Approved',
      category: 'Essential Growth'
    },
    {
      title: 'Suren Dental Care - Advanced UI/UX & Custom Web Portal',
      clinic: 'Suren Dental Care',
      contact: 'Dr. Surendhar',
      phone: '8220378777',
      dealValue: 75000,
      stage: 'CLOSED_WON',
      commissionAmount: 7500,
      commissionStatus: 'Payable',
      category: 'Advanced UI/UX & Web Development'
    },
    {
      title: 'SYM Multispeciality Dental Clinic - Reels Video Production Pack',
      clinic: 'SYM Multispeciality Dental Clinic',
      contact: 'Dr. M. Maheshwaran',
      phone: '9445987070',
      dealValue: 30000,
      stage: 'CLOSED_WON',
      commissionAmount: 3000,
      commissionStatus: 'Pending Approval',
      category: 'Reels & Video Production Pack'
    },
    {
      title: 'Anish Total Dental Care - Scale & Optimize Tier',
      clinic: 'Anish Total Dental Care',
      contact: 'Dr. K. Karunagaran',
      phone: '4242240802',
      dealValue: 55000,
      stage: 'NEGOTIATION',
      category: 'Scale & Optimize'
    },
    {
      title: 'Smile Care Dental Clinic - Enterprise Automation Retainer',
      clinic: 'Smile Care Dental Clinic and Implant Centre',
      contact: 'Dr. Mainkandan Ramasamy',
      phone: '9047857691',
      dealValue: 120000,
      stage: 'PROPOSAL_SENT',
      category: 'Enterprise Automation'
    }
  ];

  for (const item of nandhiniDeals) {
    const dealId = crypto.randomUUID();
    await pool.query(
      `INSERT INTO sales_deals 
       (id, title, client_id, lead_id, contact_name, contact_email, contact_phone, deal_value, currency, stage, probability, expected_close_date, actual_close_date, owner_id, notes, created_at, updated_at)
       VALUES (?, ?, NULL, NULL, ?, ?, ?, ?, 'INR', ?, ?, '2026-10-31', ?, ?, ?, NOW(), NOW())`,
      [
        dealId,
        item.title,
        item.contact,
        'contact@nandhinidental.in',
        item.phone,
        item.dealValue,
        item.stage,
        item.stage === 'CLOSED_WON' ? 100 : 65,
        item.stage === 'CLOSED_WON' ? '2026-10-14' : null,
        NANDHINI_ID,
        `BDA: Nandhini K | Category: ${item.category} | Clinic: ${item.clinic}`
      ]
    );

    if (item.stage === 'CLOSED_WON') {
      const commId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO sales_commissions
         (id, deal_id, bda_user_id, eligible_amount, commission_rate, commission_amount, status, approved_at, paid_at, payment_reference, created_at, updated_at)
         VALUES (?, ?, ?, ?, 10.00, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          commId,
          dealId,
          NANDHINI_ID,
          item.dealValue,
          item.commissionAmount,
          item.commissionStatus,
          item.commissionStatus === 'Approved' || item.commissionStatus === 'Payable' || item.commissionStatus === 'Paid' ? new Date() : null,
          item.commissionStatus === 'Paid' ? new Date() : null,
          item.commissionStatus === 'Paid' ? `TXN-ETH-${Math.floor(100000 + Math.random() * 900000)}` : null
        ]
      );
    }
  }

  // Create Targets for both BDAs
  await pool.query(
    `INSERT INTO sales_targets
     (id, user_id, fiscal_year, period_type, period_label, target_revenue, achieved_revenue, deals_target, deals_won, created_at, updated_at)
     VALUES 
     (?, ?, '2026-27', 'MONTHLY', 'October 2026', 300000.00, 305000.00, 6, 4, NOW(), NOW()),
     (?, ?, '2026-27', 'MONTHLY', 'October 2026', 350000.00, 305000.00, 7, 5, NOW(), NOW())`,
    [crypto.randomUUID(), MATHISHREE_ID, crypto.randomUUID(), NANDHINI_ID]
  );
  console.log('Targets successfully seeded.');

  // Verification counts
  const [dealCount] = await pool.query('SELECT COUNT(*) as total FROM sales_deals');
  const [commCount] = await pool.query('SELECT COUNT(*) as total FROM sales_commissions');
  const [mathiComm] = await pool.query('SELECT COUNT(*) as total, SUM(commission_amount) as sum FROM sales_commissions WHERE bda_user_id = ?', [MATHISHREE_ID]);
  const [nandhiniComm] = await pool.query('SELECT COUNT(*) as total, SUM(commission_amount) as sum FROM sales_commissions WHERE bda_user_id = ?', [NANDHINI_ID]);

  console.log(`\nVerification Summary:`);
  console.log(`- Total Deals: ${dealCount[0].total}`);
  console.log(`- Total Commissions: ${commCount[0].total}`);
  console.log(`- Mathishree S Commissions: ${mathiComm[0].total} records | Total ₹${mathiComm[0].sum}`);
  console.log(`- Nandhini K Commissions: ${nandhiniComm[0].total} records | Total ₹${nandhiniComm[0].sum}`);

  process.exit(0);
}

seedBlueprint().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
