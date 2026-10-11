const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const dummyVehicles = [
    {
        vehicleNumber: "DL-01-AB-1234",
        model: "Honda City 2024",
        type: "Car",
        owner: "Arnav Arya",
        insuranceExpiry: "2027-01-15",
        status: "Active"
    },
    {
        vehicleNumber: "MH-02-CD-5678",
        model: "Tata Nexon EV",
        type: "Car",
        owner: "Priya Sharma",
        insuranceExpiry: "2026-11-20",
        status: "Active"
    },
    {
        vehicleNumber: "KA-03-EF-9012",
        model: "Royal Enfield Classic 350",
        type: "Bike",
        owner: "Rohan Verma",
        insuranceExpiry: "2026-08-10",
        status: "Active"
    },
    {
        vehicleNumber: "DL-04-GH-3456",
        model: "Mahindra Thar 4x4",
        type: "Car",
        owner: "Vikram Singh",
        insuranceExpiry: "2027-05-18",
        status: "Under Maintenance"
    },
    {
        vehicleNumber: "HR-26-JK-7890",
        model: "Ashok Leyland Dost",
        type: "Truck",
        owner: "Rajesh Kumar",
        insuranceExpiry: "2026-12-05",
        status: "Active"
    },
    {
        vehicleNumber: "UP-16-LM-2345",
        model: "Ola S1 Pro",
        type: "Scooter",
        owner: "Ananya Gupta",
        insuranceExpiry: "2027-03-22",
        status: "Active"
    },
    {
        vehicleNumber: "DL-01-NP-6789",
        model: "Volvo 9600 Multi-Axle",
        type: "Bus",
        owner: "City Transit Corp",
        insuranceExpiry: "2026-09-30",
        status: "Active"
    },
    {
        vehicleNumber: "MH-12-QR-1122",
        model: "Hyundai Creta SX",
        type: "Car",
        owner: "Sameer Kulkarni",
        insuranceExpiry: "2026-07-14",
        status: "Inactive"
    },
    {
        vehicleNumber: "KA-05-ST-3344",
        model: "Yamaha R15 V4",
        type: "Bike",
        owner: "Karthik Reddy",
        insuranceExpiry: "2027-02-28",
        status: "Active"
    },
    {
        vehicleNumber: "DL-09-UV-5566",
        model: "Tata Ace Gold",
        type: "Truck",
        owner: "Quick Logistics",
        insuranceExpiry: "2026-10-25",
        status: "Under Maintenance"
    },
    {
        vehicleNumber: "HR-55-WX-7788",
        model: "Maruti Suzuki Swift",
        type: "Car",
        owner: "Neha Patel",
        insuranceExpiry: "2027-06-12",
        status: "Active"
    },
    {
        vehicleNumber: "UP-32-YZ-9900",
        model: "Force Traveller 26",
        type: "Van",
        owner: "Apex School Transit",
        insuranceExpiry: "2026-11-15",
        status: "Active"
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB Atlas for seeding...");

        for (const item of dummyVehicles) {
            const exists = await Vehicle.findOne({ vehicleNumber: item.vehicleNumber });
            if (!exists) {
                await Vehicle.create(item);
                console.log(`Added vehicle: ${item.vehicleNumber} (${item.model})`);
            } else {
                console.log(`Vehicle ${item.vehicleNumber} already exists`);
            }
        }

        const adminEmail = "admin@vehicle.com";
        const adminExists = await User.findOne({ email: adminEmail });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("admin123", salt);
            await User.create({
                name: "System Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "admin"
            });
            console.log(`Created default admin: ${adminEmail} / admin123`);
        } else {
            console.log(`Admin ${adminEmail} already exists`);
        }

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err.message);
        process.exit(1);
    }
};

seedData();
