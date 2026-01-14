const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load env vars
dotenv.config({ path: __dirname + '/.env' });

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const users = [
    {
        role: 'senior',
        seniorId: 'SEN001',
        name: 'Ramesh Kumar',
        phone: '9876543210',
        pin: '1234',
        dob: '1950-05-15',
        gender: 'Male',
        bloodGroup: 'O+',
        address: 'Mumbai, Maharashtra',
        emergencyPrimary: { name: 'Priya Kumar', contact: '9876543211', relation: 'Daughter' },
    },
    {
        role: 'doctor',
        name: 'Anjali Sharma',
        phone: '9876543220',
        pin: '5678',
        specialization: 'Cardiologist',
        regNo: 'MED12345',
        clinic: 'City Heart Hospital',
        city: 'Mumbai'
    },
    {
        role: 'caretaker',
        name: 'Sunita Devi',
        phone: '9876543230',
        pin: '9012',
        relation: 'Professional Nurse',
        address: 'Mumbai'
    },
    {
        role: 'family',
        name: 'Priya Kumar',
        phone: '9876543240',
        pin: '3456',
        relation: 'Daughter',
        address: 'Pune, Maharashtra'
    }
];

const importData = async () => {
  try {
    await User.deleteMany();
    await User.create(users);
    console.log('Data Imported!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
