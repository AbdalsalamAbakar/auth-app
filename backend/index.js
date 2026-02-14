const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 MongoDB Connected... ready for users!"))
  .catch(err => console.log("❌ Connection Error: ", err));

// --- MIDDLEWARE TO PROTECT ADMIN ROUTES ---
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

// --- AUTH ROUTES ---

app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error during signup" });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: "Server error during login" });
    }
});

// --- ADMIN ROUTES ---

// 1. Get all users (Protected)
app.get('/api/users', verifyAdmin, async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Don't send passwords to frontend!
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// 2. Delete a user (Protected)
app.delete('/api/users/:id', verifyAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting user" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));