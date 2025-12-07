const { Pool } = require('pg');
const { MongoClient } = require('mongodb');

// PostgreSQL connection
const pgPool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'iog_platform',
  user: 'postgres',
  password: 'postgres',
});

// MongoDB connection
const mongoUrl = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string';

async function generateSampleComplaints() {
  const categories = ['INFRASTRUCTURE', 'WATER_SUPPLY', 'ELECTRICITY', 'SANITATION', 'ROADS', 'HEALTHCARE', 'EDUCATION'];
  const statuses = ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  
  const complaints = [];
  for (let i = 1; i <= 50; i++) {
    complaints.push({
      title: `Sample Complaint ${i}`,
      description: `This is a sample complaint for testing purposes. Issue #${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      location: `Location ${i}`,
      address: `${i} Sample Street, Test City`,
      pincode: `${110000 + i}`,
      state: 'Delhi',
      district: 'Central Delhi',
    });
  }
  
  return complaints;
}

async function generateSampleCrimes() {
  const crimeTypes = ['THEFT', 'ROBBERY', 'ASSAULT', 'FRAUD', 'CYBERCRIME', 'BURGLARY'];
  const statuses = ['REGISTERED', 'UNDER_INVESTIGATION', 'CHARGE_SHEET_FILED', 'TRIAL'];
  
  const crimes = [];
  for (let i = 1; i <= 30; i++) {
    crimes.push({
      crime_type: crimeTypes[Math.floor(Math.random() * crimeTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      incident_date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      incident_time: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
      location: `Crime Location ${i}`,
      address: `${i} Crime Street, Test City`,
      pincode: `${110000 + i}`,
      description: `Sample crime incident description ${i}`,
      police_station: `PS ${Math.floor(Math.random() * 10) + 1}`,
    });
  }
  
  return crimes;
}

async function generateSampleJobs() {
  const titles = [
    'Software Developer', 'Data Analyst', 'Civil Engineer', 'Teacher', 
    'Nurse', 'Accountant', 'Marketing Manager', 'Sales Executive',
    'Graphic Designer', 'Content Writer', 'HR Manager', 'Business Analyst'
  ];
  
  const companies = [
    'Tech Corp India', 'Analytics Inc', 'Build Solutions', 'EduTech',
    'HealthCare Plus', 'Finance Pro', 'Marketing Hub', 'Sales Force',
    'Design Studio', 'Content Masters', 'HR Solutions', 'Business Insights'
  ];
  
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];
  
  const jobs = [];
  for (let i = 0; i < 100; i++) {
    const title = titles[Math.floor(Math.random() * titles.length)];
    jobs.push({
      title,
      company: companies[Math.floor(Math.random() * companies.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      salary_min: 300000 + Math.floor(Math.random() * 500000),
      salary_max: 800000 + Math.floor(Math.random() * 1200000),
      experience_required: Math.floor(Math.random() * 10),
      description: `Exciting opportunity for ${title}. Join our growing team!`,
      requirements: ['Relevant degree', 'Good communication', 'Team player'],
      job_type: ['FULL_TIME', 'PART_TIME', 'CONTRACT'][Math.floor(Math.random() * 3)],
      posted_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      application_deadline: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
      is_active: true,
    });
  }
  
  return jobs;
}

async function insertSampleData() {
  try {
    console.log('🔄 Generating sample data...');
    
    // Generate data
    const complaints = await generateSampleComplaints();
    const crimes = await generateSampleCrimes();
    const jobs = await generateSampleJobs();
    
    console.log(`✅ Generated ${complaints.length} complaints`);
    console.log(`✅ Generated ${crimes.length} crimes`);
    console.log(`✅ Generated ${jobs.length} jobs`);
    
    console.log('\n📊 Sample data generation complete!');
    console.log('Note: Run appropriate INSERT queries to add this data to your database');
    
  } catch (error) {
    console.error('❌ Error generating sample data:', error);
  } finally {
    await pgPool.end();
  }
}

// Run if called directly
if (require.main === module) {
  insertSampleData();
}

module.exports = {
  generateSampleComplaints,
  generateSampleCrimes,
  generateSampleJobs,
};
