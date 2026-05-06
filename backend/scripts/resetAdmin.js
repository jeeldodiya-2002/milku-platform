const mongoose = require('mongoose');
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

const resetAdmin = async () => {
  try {
    // Priority: .env followed by fallback for local testing
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/milku";
    
    console.log("\n📡 Connecting to Database...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connection established.");

    const result = await Admin.deleteMany({});
    console.log(`\n🗑️  SUCCESS: ${result.deletedCount} old admin account(s) cleared.`);
    console.log("ACTION: Now run 'npm run create-admin' to set your new passphrase.\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ RESET FAILED: ", error.message);
    process.exit(1);
  }
};

resetAdmin();
