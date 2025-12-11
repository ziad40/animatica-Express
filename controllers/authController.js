const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    const { name, email, password, role, fullName } = req.body || {};
    if (!name || !email || !password || !fullName || !role) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = await User.findOne({ username: name });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ fullName, name, email, password, role });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            await bcrypt.compare(password, ""); // Dummy compare to mitigate timing attacks
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = { user: { id: user._id , username : user.name, fullname : user.fullName, role: user.role} };
        jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};