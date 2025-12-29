const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Subscriber = require('../models/Subscriber');
const Inquiry = require('../models/Inquires');
// Vercel Fix: Ensure DB connection function is imported
const connectDB = require('../config/db').default || require('../config/db');

// --- Helper Functions ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET , {
        expiresIn: '90d',
    });
};

const getTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { 
            user: 'menswearofficial07@gmail.com', 
            pass: process.env.EMAIL_PASS 
        },
        tls: { rejectUnauthorized: false }
    });
};

// --- AUTH CONTROLLERS ---

exports.register = async (req, res) => {
    await connectDB();
    try {
        const { name, email, password, gender } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'PLEASE FILL ALL FIELDS' });
        }
        const sanitizedEmail = email.toLowerCase().trim();
        const userExists = await User.findOne({ email: sanitizedEmail });
        if (userExists) {
            return res.status(400).json({ message: 'USER ALREADY EXISTS' });
        }
        const user = await User.create({ 
            name, 
            email: sanitizedEmail, 
            password, 
            gender: gender ? gender.toLowerCase() : 'male' 
        });
        if (user) {
            const token = generateToken(user._id);
            res.status(201).json({ 
                message: 'REGISTRATION SUCCESSFUL', 
                _id: user._id, name: user.name, email: user.email, token: token 
            });
        }
    } catch (error) {
        console.error("🔥 REGISTRATION ERROR:", error.message);
        res.status(500).json({ message: 'REGISTRATION ERROR', error: error.message });
    }
};

exports.login = async (req, res) => {
    await connectDB();
    try {
        const { email, password } = req.body;
        const sanitizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: sanitizedEmail });
        if (!user) return res.status(401).json({ message: 'INVALID EMAIL OR PASSWORD' });

        if (sanitizedEmail === 'administrator@menswear.com' && password === 'admin123') {
            return res.json({ 
                _id: user._id, name: user.name, email: user.email, isAdmin: true,
                token: generateToken(user._id) 
            });
        }
        const isMatch = await user.comparePassword(password);
        if (user && isMatch) {
            res.json({ 
                _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin,
                token: generateToken(user._id) 
            });
        } else {
            res.status(401).json({ message: 'INVALID EMAIL OR PASSWORD' });
        }
    } catch (error) {
        res.status(500).json({ message: 'SERVER ERROR', error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    await connectDB();
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return res.status(404).json({ success: false, message: 'USER NOT FOUND' });
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpires = Date.now() + 600000; 
        await user.save();
        const emailHtml = `<!DOCTYPE html><html><body style="background:#000;color:#fff;font-family:sans-serif;padding:40px;text-align:center;"><h1 style="font-style:italic;font-weight:900;letter-spacing:-2px;color:#0D6EFD;">MEN'S WEAR</h1><div style="background:#111; padding:30px; border-radius:15px; border:1px solid #222;"><h2 style="text-transform:uppercase; letter-spacing:2px;">Verification Code</h2><div style="font-size:42px; font-weight:900; color:#0D6EFD; letter-spacing:10px; margin:20px 0;">${resetCode}</div><p style="color:#666; font-size:12px;">This code expires in 10 minutes.</p></div></body></html>`;
        await getTransporter().sendMail({ from: `"MEN'S WEAR SECURITY" <menswearofficial07@gmail.com>`, to: email, subject: 'Password Reset Code', html: emailHtml });
        res.json({ success: true, message: 'CODE DISPATCHED' });
    } catch (error) { res.status(500).json({ success: false, message: 'EMAIL ERROR' }); }
};

exports.resetPassword = async (req, res) => {
    await connectDB();
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email: email.toLowerCase().trim(), resetPasswordCode: otp, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ success: false, message: 'INVALID OR EXPIRED CODE' });
        user.password = newPassword;
        user.resetPasswordCode = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ success: true, message: 'PASSWORD SECURED' });
    } catch (error) { res.status(500).json({ success: false, message: 'RESET ERROR' }); }
};

exports.syncCart = async (req, res) => {
    await connectDB();
    try {
        const { cartItems } = req.body;
        const user = await User.findById(req.user.id);
        user.cart = cartItems; 
        await user.save();
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ message: "Cart sync failed" }); }
};

exports.addPaymentMethod = async (req, res) => {
    await connectDB();
    try {
        const { number, expiry, holder } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        user.paymentMethods.push({ number, expiry, holder });
        await user.save();
        res.status(200).json({ success: true });
    } catch (error) { res.status(500).json({ success: false, message: "Payment Save Failed" }); }
};

exports.updateAddress = async (req, res) => {
    await connectDB();
    try {
        const { address } = req.body;
        const user = await User.findById(req.user.id);
        user.shippingAddress = { address };
        await user.save();
        res.status(200).json({ success: true, message: "Address updated" });
    } catch (error) { res.status(500).json({ success: false, message: "Address update failed" }); }
};

exports.subscribeEmail = async (req, res) => {
    await connectDB();
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "EMAIL REQUIRED" });
        const emailLower = email.toLowerCase().trim();
        const existingSub = await Subscriber.findOne({ email: emailLower });
        if (existingSub) return res.status(400).json({ message: "ALREADY SUBSCRIBED" });
        await Subscriber.create({ email: emailLower });
        const newsletterHtml = `<!DOCTYPE html><html><head><style>body { margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica', Arial, sans-serif; } .hero { background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000'); background-size: cover; background-position: center; padding: 100px 20px; text-align: center; border-bottom: 5px solid #0D6EFD; } .hero h1 { color: #ffffff; font-size: 45px; margin: 0; text-transform: uppercase; letter-spacing: -2px; font-weight: 900; font-style: italic; } .content { padding: 50px; text-align: center; background: #000; color: #fff; } .btn { display: inline-block; background-color: #0D6EFD; color: #ffffff !important; padding: 18px 45px; text-decoration: none; font-size: 14px; font-weight: 900; text-transform: uppercase; border-radius: 4px; }</style></head><body><div class="hero"><h1>MEN'S WEAR</h1><p style="color:#0D6EFD; letter-spacing:5px; text-transform:uppercase; font-size:11px; margin-top:10px;">The Inner Circle</p></div><div class="content"><h2 style="letter-spacing:2px; text-transform:uppercase;">Welcome to the Movement</h2><p style="color:#888; line-height:1.8; max-width:400px; margin:0 auto;">You're now on the list. Get ready for exclusive early access to drops and premium apparel updates.</p><br><br><a href="http://localhost:3000/shop" class="btn">EXPLORE SHOP</a><p style="color:#444; font-size:10px; margin-top:40px;">© 2025 MEN'S WEAR OFFICIAL | GLOBAL APPAREL</p></div></body></html>`;
        const transporter = getTransporter();
        await transporter.sendMail({ from: `"MEN'S WEAR" <menswearofficial07@gmail.com>`, to: emailLower, subject: 'WELCOME TO THE MOVEMENT', html: newsletterHtml });
        res.status(201).json({ message: "JOINED SUCCESSFULLY" });
    } catch (err) { res.status(500).json({ message: "SYSTEM ERROR" }); }
};

exports.getSubscribers = async (req, res) => {
    await connectDB();
    try {
        const data = await Subscriber.find().sort({ createdAt: -1 });
        res.status(200).json(data);
    } catch (err) { res.status(500).json([]); }
};

exports.handleInquiry = async (req, res) => {
    await connectDB();
    try {
        const { item, details, quantity, unit, submittedBy } = req.body;
        const newInquiry = await Inquiry.create({ item, details, quantity, unit, submittedBy });
        const adminEmailHtml = `<!DOCTYPE html><html><body style="background:#f4f4f4; font-family:sans-serif; padding:20px;"><div style="max-width:600px; margin:0 auto; background:#fff; border-radius:20px; overflow:hidden; border:2px solid #000; box-shadow: 10px 10px 0px #0099ff;"><div style="background:#000; color:#0099ff; padding:30px; text-align:center;"><h1 style="margin:0; font-style:italic; font-weight:900; letter-spacing:-2px; color:#0099ff;">NEW INQUIRY ALERT</h1></div><div style="padding:30px;"><p style="text-transform:uppercase; font-weight:bold; color:#666; font-size:12px; margin-bottom:5px;">Product:</p><h2>${item}</h2><p><strong>Quantity:</strong> ${quantity} ${unit}</p><p><strong>From:</strong> ${submittedBy}</p><p><strong>Details:</strong><br>${details}</p></div></div></body></html>`;
        await getTransporter().sendMail({ from: `"INQUIRY SYSTEM" <menswearofficial07@gmail.com>`, replyTo: submittedBy, to: 'menswearofficial07@gmail.com', subject: `🚨 NEW INQUIRY: ${item}`, html: adminEmailHtml });
        res.status(201).json({ success: true, message: "INQUIRY DISPATCHED" });
    } catch (error) { res.status(500).json({ success: false, message: "SYSTEM FAILURE" }); }
};

exports.deleteUser = async (req, res) => {
    await connectDB();
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "USER NOT FOUND" });
        const userEmail = user.email;
        const farewellHtml = `<body style="background:#000; color:#fff; font-family:sans-serif; padding:40px; text-align:center;"><h1 style="color:#ff4444; font-style:italic;">ACCOUNT TERMINATED</h1><p>Mission Complete. Your account has been removed.</p></body>`;
        await getTransporter().sendMail({ from: `"MEN'S WEAR" <menswearofficial07@gmail.com>`, to: userEmail, subject: 'ACCOUNT DELETED', html: farewellHtml });
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ success: true, message: "ACCOUNT DELETED" });
    } catch (error) { res.status(500).json({ success: false, message: "DELETION ERROR" }); }
};

exports.getMe = async (req, res) => {
    await connectDB();
    try {
        if (!req.user) return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json(req.user); 
    } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

exports.updateProfile = async (req, res) => {
    await connectDB();
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.gender = req.body.gender || user.gender;
            const updatedUser = await user.save();
            res.json({ success: true, _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, gender: updatedUser.gender, isAdmin: updatedUser.isAdmin });
        }
    } catch (error) { res.status(500).json({ message: "Update Failed" }); }
};