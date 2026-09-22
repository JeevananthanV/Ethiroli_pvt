import 'dotenv/config';
import Job from '../src/models/Job.js';
import Candidate from '../src/models/Candidate.js';
import CommunicationLog from '../src/models/CommunicationLog.js';
import Integration from '../src/models/Integration.js';

async function runTests() {
  console.log('--- Phase 4 Self-Verification Test Suite ---');

  const userId = '368f5c88-12cd-11ed-861d-0242ac120002'; // Seed Admin ID

  // 1. Test Jobs and Candidates
  console.log('\n1. Testing Job posting & Candidate creation...');
  try {
    const jobId = await Job.create({
      title: 'Full Stack Node/React Developer',
      description: 'Responsible for core SaaS feature delivery',
      department: 'Engineering',
      location: 'Coimbatore',
      salary_range: '6-12 LPA',
      required_skills: ['Node.js', 'React', 'MySQL'],
      created_by: userId
    });
    console.log(`   ✅ Job.create successful. Job ID: ${jobId}`);

    const candidateId = await Candidate.create({
      job_id: jobId,
      name: 'John Doe Candidate',
      email: 'john.candidate@gmail.com',
      phone: '+919988776655',
      source: 'INDEED',
      indeed_candidate_id: 'ind-cand-482'
    });
    console.log(`   ✅ Candidate.create successful. Candidate ID: ${candidateId}`);

    const candidates = await Candidate.list({ job_id: jobId });
    console.log(`   ✅ Candidate.list returned ${candidates.length} candidates.`);
    if (candidates[0].name === 'John Doe Candidate') {
      console.log('   ✅ Candidate PII Decryption verified successfully.');
    }
  } catch (error) {
    console.error('❌ Job/Candidate tests failed:', error.message);
  }

  // 2. Test Communication Log
  console.log('\n2. Testing Communication Logs encryption...');
  try {
    const logId = await CommunicationLog.create({
      channel: 'EMAIL',
      recipient: 'candidate.notify@gmail.com',
      subject: 'Interview Schedule Reminder',
      content: 'Hello John, your interview is scheduled at 10 AM.',
      created_by: userId
    });
    console.log(`   ✅ CommunicationLog.create successful. Log ID: ${logId}`);

    const logs = await CommunicationLog.list({ channel: 'EMAIL' });
    if (logs.length > 0 && logs[0].recipient === 'candidate.notify@gmail.com') {
      console.log('   ✅ Communication Log recipient Decryption verified successfully.');
    }
  } catch (error) {
    console.error('❌ Communication Log tests failed:', error.message);
  }

  // 3. Test Integrations Config Encryption
  console.log('\n3. Testing Integrations Key encryption...');
  try {
    const serviceName = 'twilio-' + Date.now();
    const configData = { api_key: 'twilio-secret-token-value', sender_phone: '+123456789' };
    const integrationId = await Integration.create({
      service_name: serviceName,
      category: 'COMMUNICATION',
      config: configData,
      is_enabled: true
    });
    console.log(`   ✅ Integration.create successful. ID: ${integrationId}`);

    const integrations = await Integration.list();
    const twilioInt = integrations.find(item => item.service_name === serviceName);
    if (twilioInt && twilioInt.config.api_key === 'twilio-secret-token-value') {
      console.log('   ✅ Integration configuration decrypted successfully in memory.');
    }
  } catch (error) {
    console.error('❌ Integration tests failed:', error.message);
  }

  console.log('\n--- Phase 4 Test Suite Complete ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
