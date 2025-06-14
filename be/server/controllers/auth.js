const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const jwtSecret = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If you're using bcrypt, compare passwords here:
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("User found:", user._id);
    console.log("Password match:", user.password, password, isMatch);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, { httpOnly: true });
    console.log("User logged in:", user._id);
    // ✅ Always send response
    return res.status(200).json({
      message: 'Login successful',
      token, // optional if you're storing in cookie
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



exports.register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Hash password (optional if your model uses pre-save middleware)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};

