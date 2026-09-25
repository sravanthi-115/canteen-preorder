const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/user");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const existingAdmin = await User.findOne({
            email: "admin@canteen.com"
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);

        await User.create({
            name: "Canteen Admin",
            email: "admin@canteen.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created successfully");

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
};

createAdmin();