// Verification script for ₹0-First integrations: n8n, FCM, Indeed, Brevo

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Starting Integration Verifications ---');

  // 1. Test Indeed XML Feed
  console.log('\n[1/5] Testing Indeed XML Job Feed...');
  try {
    const feedRes = await fetch(`${BASE_URL}/v1/jobs-board/indeed/feed.xml`);
    const xmlText = await feedRes.text();
    const isXml = feedRes.headers.get('content-type')?.includes('xml') || xmlText.startsWith('<?xml');
    console.log(`Status: ${feedRes.status}`);
    console.log(`Content-Type: ${feedRes.headers.get('content-type')}`);
    console.log(`Is Valid XML Root (<source>): ${xmlText.includes('<source>') && xmlText.includes('</source>')}`);
    console.log(`Feed Snippet:\n${xmlText.slice(0, 250)}...`);
    if (!isXml) throw new Error('Indeed XML feed did not return XML');
  } catch (err) {
    console.error('Indeed XML Feed Test Failed:', err.message);
  }

  // 2. Test Indeed Apply Webhook (Inbound Candidate Ingestion)
  console.log('\n[2/5] Testing Indeed Apply Candidate Webhook Ingestion...');
  try {
    const applyPayload = {
      applicant: {
        fullName: 'Arun Kumar (Indeed Candidate)',
        email: `arun.kumar.${Date.now()}@example.com`,
        phoneNumber: '+91 99887 76655',
        resumeUrl: 'https://ethiroli.com/resumes/arun_kumar.pdf',
        applicantId: `ind_test_${Date.now()}`
      }
    };

    const applyRes = await fetch(`${BASE_URL}/v1/webhooks/indeed/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applyPayload)
    });

    const applyData = await applyRes.json();
    console.log(`Status: ${applyRes.status}`);
    console.log('Result:', JSON.stringify(applyData, null, 2));
    if (!applyRes.ok) throw new Error(applyData.message || 'Indeed Apply webhook failed');
  } catch (err) {
    console.error('Indeed Apply Webhook Test Failed:', err.message);
  }

  // 3. Test Brevo Email Quota Guardian & Test Email
  console.log('\n[3/5] Testing Brevo Quota & Email Dispatch...');
  try {
    // We test direct service function for auth-bypassed internal test
    const { getDailyQuotaStatus, sendBrevoEmail } = await import('../src/services/brevoService.js');
    const quotaBefore = await getDailyQuotaStatus();
    console.log('Quota Before Dispatch:', quotaBefore);

    const emailRes = await sendBrevoEmail({
      to: 'test.candidate@example.com',
      subject: 'Ethiroli ₹0-First Brevo Test',
      html: '<p>Testing Brevo 300/day email delivery engine.</p>'
    });
    console.log('Email Dispatch Result:', emailRes);

    const quotaAfter = await getDailyQuotaStatus();
    console.log('Quota After Dispatch:', quotaAfter);
  } catch (err) {
    console.error('Brevo Email Test Failed:', err.message);
  }

  // 4. Test n8n Inbound Action Callback
  console.log('\n[4/5] Testing n8n Inbound Action Webhook...');
  try {
    const n8nPayload = {
      action: 'trigger_notification',
      role: 'HR',
      title: 'n8n Automation Event',
      body: 'Automated candidate screening completed by n8n workflow.',
      data: { workflowId: 'test-wf-1' }
    };

    const n8nRes = await fetch(`${BASE_URL}/v1/webhooks/n8n/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-Webhook-Secret': 'ethiroli_n8n_secret_key_2026'
      },
      body: JSON.stringify(n8nPayload)
    });

    const n8nData = await n8nRes.json();
    console.log(`Status: ${n8nRes.status}`);
    console.log('Result:', JSON.stringify(n8nData, null, 2));
    if (!n8nRes.ok) throw new Error(n8nData.message || 'n8n webhook action failed');
  } catch (err) {
    console.error('n8n Webhook Action Failed:', err.message);
  }

  // 5. Test FCM Service Dispatch & Device Registration
  console.log('\n[5/5] Testing FCM Push Notification Dispatch...');
  try {
    const { sendToRole } = await import('../src/services/fcmService.js');
    const fcmRes = await sendToRole('HR', {
      title: 'FCM Verification Push',
      body: 'Firebase Cloud Messaging integration test completed successfully.',
      url: '/app/hr'
    });
    console.log('FCM Dispatch Result:', fcmRes);
  } catch (err) {
    console.error('FCM Test Failed:', err.message);
  }

  console.log('\n--- Integration Verifications Finished ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test Suite Unhandled Error:', err);
  process.exit(1);
});
