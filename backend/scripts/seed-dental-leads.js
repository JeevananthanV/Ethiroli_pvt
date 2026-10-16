import pool from '../src/config/database.js';
import { encrypt } from '../src/config/encryption.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const MATHISHREE_ID = 'eadd2eb6-b0af-4e3f-aa82-a08e29d891ee';
const NANDHINI_ID = '66da1638-9a06-4741-9ed2-8054b0417313';

// 100 dental leads structured by Area and BDA
const LEADS_DATA = [
  // ==========================================
  // RASIPURAM - BDA: Mathishree S (15 leads)
  // ==========================================
  { area: 'Rasipuram', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Sri Saai Dental Clinic', doctor: 'Dr. N. Srinivasan', phone: '7397556911' },
  { area: 'Rasipuram', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: "Sree's Smile Care Dental Clinic", doctor: 'Dr. Pradeep', phone: '8523990979' },
  { area: 'Rasipuram', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Soundaria Dental Clinic', doctor: 'Dr. Soundaria', phone: '9600207722' },
  { area: 'Rasipuram', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Muthuvel Dental Clinic', doctor: 'Dr. Aruleeswaran', phone: '9842725602' },
  { area: 'Rasipuram', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Merlion Dental Care', doctor: 'Dr. Saravanakumar', phone: '8148029600' },
  { area: 'Rasipuram', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Raja Dental Clinic', doctor: 'Dr. K. Yogesh', phone: '7603997700' },
  { area: 'Rasipuram', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Kumaran Dental Clinic', doctor: 'Dr. Elanchezhiyan', phone: '9443591812' },
  { area: 'Rasipuram', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Pearlon Dental Clinic', doctor: 'Dr. Sowmiya Ravichandran', phone: '8300263056' },
  { area: 'Rasipuram', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Shri Krishna Dental Clinic', doctor: 'Dr. C. Leelavathi', phone: '9940259838' },
  { area: 'Rasipuram', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Shri Devi Dental Clinic', doctor: 'Dr. S. Rajasekar', phone: '8903176201' },
  { area: 'Rasipuram', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Royal Dental Hospital', doctor: 'Dr. Sathish Kumar', phone: '9789487959' },
  { area: 'Rasipuram', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: "Amirthaa's Elite Dental Clinic", doctor: 'Dr. Amirthaa Duraisamy', phone: '8870772498' },
  { area: 'Rasipuram', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'karthi Dental Care', doctor: 'Dr. J.K. Sudharshini', phone: '9791457916' },
  { area: 'Rasipuram', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'anandhi Shubiksham Clinic', doctor: 'Dr. Anandhi', phone: '9894677657' },
  { area: 'Rasipuram', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Harish Dental Clinic', doctor: 'Dr. Harish', phone: '9498412878' },

  // ==========================================
  // ERODE - BDA: Mathishree S (10 leads)
  // ==========================================
  { area: 'Erode', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'G-Dent Dental Clinic', doctor: 'Dr. Divakar', phone: '8973050555' },
  { area: 'Erode', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Ravi Dental Care Center', doctor: 'Dr. O.N. Ravi', phone: '9788151777' },
  { area: 'Erode', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'SM Dental Clinic', doctor: 'Dr. S.M. Satheesh', phone: '8012171650' },
  { area: 'Erode', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Care 24 Hospital', doctor: 'Dr. S.N. Neelavathi', phone: '9597222666' },
  { area: 'Erode', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'DentiQ Super Speciality Hospital', doctor: 'Dr. T. Balamurugan', phone: '8489488999' },
  { area: 'Erode', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Apollo Dental', doctor: 'Dr. Kiruthiga', phone: '8220491793' },
  { area: 'Erode', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: "Mithra's Dental Studio", doctor: 'Dr. Sowmithradevi', phone: '9384598991' },
  { area: 'Erode', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Shifa Dental Clinic', doctor: 'Dr. Mohamed adhil', phone: '8825448034' },
  { area: 'Erode', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Ramakrishna Dental', doctor: 'Dr. K. Thankamani Ammal', phone: '9994943388' },
  { area: 'Erode', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Crown Dental', doctor: 'Dr. Monika', phone: '8946013270' },

  // ==========================================
  // ERODE - BDA: Nandhini K (25 leads)
  // ==========================================
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Vanjee Multispeciality Dental', doctor: 'Dr. Senthil Kumar', phone: '9952412697' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Balaji Dental Hospital', doctor: 'Dr. Hari Prasath', phone: '6383115141' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Anish Total Dental Care', doctor: 'Dr. K. Karunagaran', phone: '4242240802' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: "Vidhu's E care Multispecialist Dental Clinic", doctor: 'Dr. VidhuBala', phone: '8525899811' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Smile Ezee Dentistry', doctor: 'Dr. Sathish Kumar', phone: '7010956291' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Faizel Dental Care', doctor: 'Dr. Mohamed Faizel', phone: '9345490144' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'JP Multispeciality Dental Hospital', doctor: 'Dr. Jaya Prakash', phone: '9790235535' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'SK Speciality Dental Center', doctor: 'No Doctor Listed', phone: '4242267670' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: "Metty's Multispeciality Dental Clinic", doctor: 'Dr. K.A. Biju', phone: '9790616527' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Balasubramanian Dental Hospital', doctor: 'Dr. Balasubramanian', phone: '9842714745' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Lakshmi Nantha Dental Hospital', doctor: 'Dr. Rajiv Nanthagopal', phone: '9843024225' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Siva Dental Hospital', doctor: 'Dr. Meenapriya', phone: '9842937028' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Prabhu Dental', doctor: 'Dr. Yoithap Prabhunath', phone: '9487412134' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Maaruthi Dental Clinic', doctor: 'Dr. Rajmohan', phone: '9894490259' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Sruthi Mulispeciality Dental Hospital', doctor: 'Dr. Sruthi', phone: '9789272175' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Krishna Dental Clinic', doctor: 'Dr. AnbuSelvan', phone: '6380032044' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Dental & Advanced Inplant Center', doctor: 'Dr. Suresh', phone: '9894457594' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Saar Dental Inplant Center', doctor: 'Dr. M. Nagarajan', phone: '8667228719' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'H Dentistry', doctor: 'Dr. Harinisri', phone: '9363629361' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Sree Arumugavadivu Multispeciality Dental Clinic', doctor: 'Dr. Hariharasudhan', phone: '9843454814' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Happy Teath Dental Care', doctor: 'Dr. Vaishnavi', phone: '9629182888' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Children Dental Hospital', doctor: 'No Doctor Listed', phone: '8124186063' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'V U Dental Care', doctor: 'Dr. Abinaya', phone: '9600841444' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Sri Ram Dental Care', doctor: 'Dr. RamKumar', phone: '9443056008' },
  { area: 'Erode', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Dr. Maruthamani Dental Care', doctor: 'Dr. Maruthamani', phone: '9597993355' },

  // ==========================================
  // NAMAKKAL - BDA: Nandhini K (25 leads)
  // ==========================================
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'iTooth Dental Clinic', doctor: 'Dr. Initha', phone: '7299400446' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Suren Dental Care', doctor: 'Dr. Surendhar', phone: '8220378777' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: "Dr Aravinth's Dental Care", doctor: 'Dr. Aravinth', phone: '9952602577' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'SYM Multispeciality Dental Clinic', doctor: 'Dr. M. Maheshwaran', phone: '9445987070' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Smile Care Dental Clinic and Implant Centre', doctor: 'Dr. Mainkandan Ramasamy', phone: '9047857691' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Sudha Dental Clinic', doctor: 'Dr. Sudha', phone: '9751153308' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'M.R. Dental Clinic', doctor: 'Dr. Gokulakannan', phone: '9487207225' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'VGS Dental Clinic', doctor: 'Dr. Praveen', phone: '9894631935' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Vitlas- A Multispecialist Dental Clinic', doctor: 'Dr. Naveen', phone: '9003900543' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Smile Evident Dental Clinic', doctor: 'Dr. Vignesh', phone: '7708306410' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'RK Dent INN', doctor: 'Dr. arun', phone: '9715768457' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'A R Dental Clinic', doctor: 'Dr. jayaKarthik', phone: '9489852324' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Thaai Dental Care', doctor: 'Dr. R.K. Venkatesan', phone: '9842550569' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Vinayaka Dental Care', doctor: 'Dr. Kavin', phone: '9150033984' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'VMK Dental', doctor: 'Dr. M. Yuvaraja', phone: '8489249077' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Bhandari Dental Care', doctor: 'Dr. pawan kumar', phone: '9787727793' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Thangam Dental Clinic', doctor: 'Dr. Tamil thangam periyasamy', phone: '9442806170' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'RR Dental Clinic', doctor: 'Dr. Pradeep', phone: '9025332382' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Nalam Dental Care', doctor: 'Dr. Ravikumar', phone: '9941123301' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Shashti Dentistry', doctor: 'Dr. sanmathi', phone: '9360375009' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Amriya Shri Dental Clinic', doctor: 'Dr. Keerthi', phone: '9003358199' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: "Dr. Preethi's Dentistry", doctor: 'Dr. Preethi', phone: '9087455557' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Dhana Dental Clinic', doctor: 'Dr. Jeevajothi', phone: '8248382331' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Grace Dental Clinic', doctor: 'Dr. Shruthi', phone: '9535115400' },
  { area: 'Namakkal', bda: 'Nandhini K', bdaId: NANDHINI_ID, clinic: 'Dhivyam Dentistry', doctor: 'Dr. Boobalan', phone: '9345884158' },

  // ==========================================
  // NAMAKKAL - BDA: Mathishree S (1 lead)
  // ==========================================
  { area: 'Namakkal', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Suryanarayana Dental Clinic', doctor: 'Dr. Lakshminarashimhan', phone: '8870021318' },

  // ==========================================
  // OMALUR - BDA: Mathishree S (21 leads)
  // ==========================================
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Jayanthi Dental clinic', doctor: 'Dr. S. Jegan', phone: '9994957603' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Good Samaritan Multispeciality Dental Clinic', doctor: 'Dr. G. Richard Willson', phone: '7942686515' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Sabari Dental Clinic', doctor: 'Dr. Sabari', phone: '9566333872' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Sastha Dental Clinic', doctor: 'Dr. R.M. Senthil Vijay', phone: '7094054959' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Shree Guru Dental Clinic', doctor: 'Dr. R.T. Sambantam', phone: '7999324712' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Pappa Dental clinic', doctor: 'Dr. Ravikumar', phone: '9952372749' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: "Dr. Kohila's Dental Centre", doctor: 'Dr. Suganya', phone: '9842264627' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Poly Dental Clinic', doctor: 'No Doctor Listed', phone: '4272312571' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Dr. George Paul Dental Poly Clinic', doctor: 'Dr. George Paul', phone: '4272447005' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: "Dr. Hema's Dental Care", doctor: 'Dr. Hema', phone: '7339542809' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'beaumont Dental Clinic', doctor: 'Dr. Diwakar', phone: '9363538854' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Siva Shakthi Dental Care', doctor: 'Dr. Gowrishankar', phone: '7667190478' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Raja Dental Care', doctor: 'Dr. Vignesh', phone: '8300685103' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: "Dr. Latha's Hospital", doctor: 'Dr. Latha', phone: '6369270832' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Dharan Dental Care', doctor: 'Dr. S. Dharanya', phone: '9385289954' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Apollo Dental Clinic', doctor: 'Dr. Manisha', phone: '8870291793' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Tree Dental Wellness', doctor: 'Dr. Abijith Baskar', phone: '8005780067' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Vairam Dental Care', doctor: 'Dr. Mohan Babu', phone: '9500006242' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Salem Dental Centre', doctor: 'Dr. Rangas', phone: '9843308369' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: "Dr. Hema's Dental Care", doctor: 'Dr. Hema', phone: '7339542809' },
  { area: 'Omalur', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'L R Hospital', doctor: 'Dr. Mane', phone: '4290243393' },

  // ==========================================
  // SALEM - BDA: Mathishree S (3 leads)
  // ==========================================
  { area: 'Salem', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Akash Dental Clinic', doctor: 'No Doctor Listed', phone: '7942692763' },
  { area: 'Salem', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: '32 Pearls Dental Clinic', doctor: 'Dr. Mani', phone: '8148338122' },
  { area: 'Salem', bda: 'Mathishree S', bdaId: MATHISHREE_ID, clinic: 'Sri vignesh Dental Clinic', doctor: 'Dr. Vignesh', phone: '9629729294' }
];

async function seed() {
  console.log(`Starting to seed ${LEADS_DATA.length} dental leads...`);

  // 1. Clean existing dummy lead
  const [delResult] = await pool.query("DELETE FROM leads WHERE name LIKE '%Lead 1790%' OR company_name IS NULL");
  console.log(`Deleted ${delResult.affectedRows} dummy/test lead(s).`);

  // 2. Grant Sales access to Mathishree and Nandhini
  console.log('Granting SALES access to Mathishree S and Nandhini K...');
  const salesPasswordHash = await bcrypt.hash('Sales@123', 10);

  for (const bdaId of [MATHISHREE_ID, NANDHINI_ID]) {
    await pool.query(
      `UPDATE users 
       SET role = 'SALES',
           preferences = JSON_SET(COALESCE(preferences, '{}'), '$.roles', CAST('["INTERN", "SALES"]' AS JSON)),
           password_hash = ?
       WHERE id = ?`,
      [salesPasswordHash, bdaId]
    );

    await pool.query(
      `INSERT INTO user_credentials 
       (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
       VALUES (?, ?, 'BCRYPT', NOW(), 0, NULL, FALSE, ?)
       ON DUPLICATE KEY UPDATE 
         password_hash = VALUES(password_hash),
         failed_login_attempts = 0,
         lockout_until = NULL,
         requires_password_change = FALSE`,
      [bdaId, salesPasswordHash, JSON.stringify([salesPasswordHash])]
    );
  }
  console.log('Sales access granted to both BDAs with dual roles [INTERN, SALES] and password Sales@123 / Intern@123.');

  // 3. Clear any existing dental leads to prevent duplicates
  await pool.query("DELETE FROM leads WHERE notes LIKE '%District%' OR notes LIKE '%BDA:%'");

  // 4. Insert all 100 dental leads
  let count = 0;
  for (const item of LEADS_DATA) {
    const id = crypto.randomUUID();
    const encName = encrypt(item.doctor);
    const encPhone = encrypt(item.phone);
    const notes = `District / Area: ${item.area} | BDA: ${item.bda} | Service: Dental CRM & Software Outreach`;

    await pool.query(
      `INSERT INTO leads 
       (id, name, first_name, last_name, company_name, email, phone, source, status, assigned_to, notes, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NULL, ?, 'PHONE', 'NEW', ?, ?, ?, NOW(), NOW())`,
      [
        id,
        encName,
        item.doctor,
        '',
        item.clinic,
        encPhone,
        item.bdaId,
        notes,
        item.bdaId
      ]
    );
    count++;
  }

  console.log(`Successfully inserted ${count} dental leads!`);

  // Verify counts
  const [totalLeads] = await pool.query('SELECT COUNT(*) as total FROM leads');
  const [mathiLeads] = await pool.query('SELECT COUNT(*) as total FROM leads WHERE assigned_to = ?', [MATHISHREE_ID]);
  const [nandhiniLeads] = await pool.query('SELECT COUNT(*) as total FROM leads WHERE assigned_to = ?', [NANDHINI_ID]);

  console.log(`\nVerification:`);
  console.log(`- Total Leads in DB: ${totalLeads[0].total}`);
  console.log(`- Leads Assigned to Mathishree S: ${mathiLeads[0].total}`);
  console.log(`- Leads Assigned to Nandhini K: ${nandhiniLeads[0].total}`);

  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
