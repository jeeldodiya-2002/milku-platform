const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Customer = require('../models/CustomerModel');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const CUSTOMER_DATA = [
    { "name": "Roopa Restaurant", "addresses": ["Railway Station Surat"], "areas": ["Railway Station"] },
    { "name": "Kabir Restaurant", "addresses": ["Railway Station Surat"], "areas": ["Railway Station"] },
    { "name": "Tulsi Hotel", "addresses": ["Lal Darwaja Surat"], "areas": ["Lal Darwaja"] },
    { "name": "Udupi Restaurant", "addresses": ["Udhna"], "areas": ["Udhna"] },
    { "name": "Sarvottam Hotel", "addresses": ["Udhna Sardar Market"], "areas": ["Udhna"] },
    { "name": "Tasty Parcel", "addresses": ["Udhna"], "areas": ["Udhna"] },
    { "name": "Prime Hotel", "addresses": ["Pandesara, Gidc"], "areas": ["Pandesara"] },
    { "name": "Decent Hotel", "addresses": ["Pandesara, Gidc"], "areas": ["Pandesara"] },
    { "name": "Darshan Hotel", "addresses": ["Pandesara, Gidc"], "areas": ["Pandesara"] },
    { "name": "Navjivan Restaurant", "addresses": ["Unn Patiya", "Varachha Road"], "areas": ["Unn Patiya", "Varachha"] },
    { "name": "Ashish Restaurant", "addresses": ["Unn Patiya"], "areas": ["Unn Patiya"] },
    { "name": "Supreme Restaurant", "addresses": ["Bhestan"], "areas": ["Bhestan"] },
    { "name": "The Yellow House", "addresses": ["Piplod Road"], "areas": ["Piplod"] },
    { "name": "Surbhi Restaurant", "addresses": ["Dindoli"], "areas": ["Dindoli"] },
    { "name": "Abhilasa Hotel", "addresses": ["Telephone Bhavan Surat"], "areas": ["Telephone Bhavan"] },
    { "name": "Concord Restaurant", "addresses": ["Adajan"], "areas": ["Adajan"] },
    { "name": "Lemon Grass Restaurant", "addresses": ["Adajan"], "areas": ["Adajan"] },
    { "name": "Topaz Restaurant", "addresses": ["Adajana"], "areas": ["Adajan"] },
    { "name": "Diamond 26 Hotel", "addresses": ["Kapodra"], "areas": ["Kapodra"] },
    { "name": "Atithi Restaurant", "addresses": ["Sarthana Jakatnaka"], "areas": ["Sarthana"] },
    { "name": "Prime Restaurant", "addresses": ["Dindoli Surat"], "areas": ["Dindoli"] },
    { "name": "Alpha Restaurant", "addresses": ["Bhatar Road"], "areas": ["Bhatar"] },
    { "name": "Real Dine Restaurant", "addresses": ["Parvat Patiya"], "areas": ["Parvat Patiya"] },
    { "name": "Zest Restaurant", "addresses": ["Parvat Patiya"], "areas": ["Parvat Patiya"] },
    { 
      "name": "Royal Dine Restaurant", 
      "addresses": ["Canal Road, Palanpur", "Green City Road", "Gaurav Path Road"], 
      "areas": ["Canal Road", "Green City", "Gaurav Path"] 
    },
    { "name": "Royal Kitchen Restaurant", "addresses": ["L.P. Savani Circle, Surat"], "areas": ["L.P. Savani"] },
    { "name": "Green Fusion Restaurant", "addresses": ["Gaurav Path Road, Surat"], "areas": ["Gaurav Path"] },
    { "name": "Dream Fostiva", "addresses": ["Gaurav Path Road, Surat"], "areas": ["Gaurav Path"] },
    { "name": "Keishna Elysium Restaurant", "addresses": ["Ugat Canal Road"], "areas": ["Canal Road"] },
    { 
      "name": "Khodiyar Kathiyavadi Dhaba", 
      "addresses": ["Pal", "Kamrej Toll Plaza"], 
      "areas": ["Pal", "Kamrej"] 
    },
    { 
      "name": "La Fountain Blue Restaurant", 
      "addresses": ["Vip Circle, Surat", "Navsari"], 
      "areas": ["Vip Circle", "Navsari"] 
    },
    { "name": "Rio Carnival", "addresses": ["Sarthana Jakatnaka"], "areas": ["Sarthana"] },
    { "name": "La Festiva", "addresses": ["Canal Road"], "areas": ["Canal Road"] },
    { "name": "La Fountain The Food Fair", "addresses": ["Canal Road"], "areas": ["Canal Road"] },
    { "name": "Royal Restaurant", "addresses": ["Sarol"], "areas": ["Sarol"] },
    { "name": "Silvernest Restaurant", "addresses": ["Ghod Dod Road"], "areas": ["Ghod Dod"] },
    { "name": "Jungle Café Restaurant", "addresses": ["Vip Road, Surat"], "areas": ["Vip Road"] },
    { "name": "Lemon Restaurant", "addresses": ["Mota Varachha"], "areas": ["Varachha"] },
    { "name": "Royal Park Restaurant", "addresses": ["Near Rangoli Chor Rasta"], "areas": ["Rangoli"] },
    { "name": "La Season Restaurant", "addresses": ["Pasodra Road"], "areas": ["Pasodra"] },
    { "name": "Giriraj Kathiyavadi Restaurant", "addresses": ["Kamrej Toll Plaza"], "areas": ["Kamrej"] },
    { "name": "The Grand Tapi Hotel", "addresses": ["Kosmadi Patiya, Surat"], "areas": ["Kosmadi"] },
    { 
      "name": "Ashirvad Restaurant", 
      "addresses": ["Kamrej Char Rasta", "Songadh Toll Plaza"], 
      "areas": ["Kamrej", "Songadh"] 
    },
    { "name": "Bhagyoday Restaurant", "addresses": ["Bardoli"], "areas": ["Bardoli"] },
    { "name": "Tulsi Restaurant", "addresses": ["Bardoli"], "areas": ["Bardoli"] },
    { "name": "Hotel Gurukrupa", "addresses": ["Manekpur"], "areas": ["Manekpur"] },
    { "name": "Ashish Hotel", "addresses": ["Manekpur"], "areas": ["Manekpur"] },
    { "name": "Way Wait Hotel", "addresses": ["Bajipara"], "areas": ["Bajipara"] },
    { "name": "The Hidden Place", "addresses": ["Vyara"], "areas": ["Vyara"] },
    { "name": "Raj Hotel", "addresses": ["Dhoran Pardi, Kamrej"], "areas": ["Kamrej"] },
    { "name": "Sifat Restaurant", "addresses": ["Railway Station Surat"], "areas": ["Railway Station"] },
    { "name": "Orange International Restaurant", "addresses": ["Railway Station Surat"], "areas": ["Railway Station"] },
    { "name": "Saffron Restaurant", "addresses": ["Udhna"], "areas": ["Udhna"] },
    { "name": "Amiras Hotel", "addresses": ["Sarthana Jakatnaka"], "areas": ["Sarthana"] },
    { "name": "Apical Hotel", "addresses": ["Valsad"], "areas": ["Valsad"] },
    { "name": "Horizone Hotel", "addresses": ["Valsad"], "areas": ["Valsad"] },
    { "name": "Papillon Hotel", "addresses": ["Gajera Circle, Katargam"], "areas": ["Katargam"] },
    { "name": "Dero By Zero Hotel", "addresses": ["Dumas, Surat"], "areas": ["Dumas"] }
];

const seedCustomers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing customers
        await Customer.deleteMany({});
        console.log('Cleared existing customers');

        // Insert new customers
        await Customer.insertMany(CUSTOMER_DATA);
        console.log(`Successfully seeded ${CUSTOMER_DATA.length} customers`);

        process.exit();
    } catch (error) {
        console.error('Error seeding customers:', error);
        process.exit(1);
    }
};

seedCustomers();
