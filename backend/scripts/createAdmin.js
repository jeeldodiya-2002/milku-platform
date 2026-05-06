const mongoose = require('mongoose');
const readline = require('readline');
const dotenv = require('dotenv');
const Admin = require('../models/AdminModel');
const path = require('path');
const fs = require('fs');

// AUTO-DETECT ENV LOCATION
const backendEnv = path.join(__dirname, '..', '.env');
const rootEnv = path.join(__dirname, '..', '..', '.env');

if (fs.existsSync(backendEnv)) {
  dotenv.config({ path: backendEnv });
} else if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdminProfile = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/milku";
    
    console.log("\n📡 Connecting to Database for Secure Setup...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connection verified.");

    // 1. Check if admin exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      console.log("\n⚠️  ACCESS DENIED: An admin account already exists in this database.");
      console.log("Only one central owner is permitted for top-level security.\n");
      process.exit(0);
    }

    console.log("\n=================================================");
    console.log("     MILKU SECURE OWNER CREATION UTILITY     ");
    console.log("=================================================");
    
    // 2. Interactive Prompts
    const pass1 = await askQuestion("\nSet your NEW Secret Passphrase: ");
    if (!pass1 || pass1.length < 5) {
       console.log("\n❌ ERROR: Passphrase is too short.\n");
       process.exit(1);
    }

    const pass2 = await askQuestion("Re-enter Passphrase to Confirm: ");

    // 3. Validation
    if (pass1 !== pass2) {
      console.log("\n❌ ERROR: Passphrases do not match. Aborting.\n");
      process.exit(1);
    }

    // 4. Save to Database
    const newAdmin = new Admin({
       passphrase: pass1 
    });

    await newAdmin.save();

    console.log("\n✅ SUCCESS: Owner Profile Created!");
    console.log("You can now log in at the bottom of the website.\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ CRITICAL ERROR: ", error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

createAdminProfile();
