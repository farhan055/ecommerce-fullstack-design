const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Subscriber = require('../models/Subscriber');
const Inquiry = require('../models/Inquires');

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

// @desc    Register new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, gender } = req.body;
        
        // 1. Check if all fields are present
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'PLEASE FILL ALL FIELDS' });
        }

        const sanitizedEmail = email.toLowerCase().trim();
        
        // 2. Check if user already exists
        const userExists = await User.findOne({ email: sanitizedEmail });
        if (userExists) {
            return res.status(400).json({ message: 'USER ALREADY EXISTS' });
        }
        
        // 3. Create user (Gender ko lowercase karein taake enum match ho)
        const user = await User.create({ 
            name, 
            email: sanitizedEmail, 
            password, 
            gender: gender ? gender.toLowerCase() : 'male' 
        });

        if (user) {
            // 4. Token generation
            const token = generateToken(user._id);

            res.status(201).json({ 
                message: 'REGISTRATION SUCCESSFUL', 
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token 
            });
        }
    } catch (error) {
        // Terminal Check
        console.error("🔥 REGISTRATION ERROR:", error.message);
        res.status(500).json({ 
            message: 'REGISTRATION ERROR', 
            error: error.message 
        });
    }
};
// @desc    Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const sanitizedEmail = email.toLowerCase().trim();
        
        const user = await User.findOne({ email: sanitizedEmail });

        if (!user) return res.status(401).json({ message: 'INVALID EMAIL OR PASSWORD' });

        // Emergency Admin Bypass
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

// @desc    Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        
        if (!user) return res.status(404).json({ success: false, message: 'USER NOT FOUND' });
        
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpires = Date.now() + 600000; 
        await user.save();

        const emailHtml = `
            <!DOCTYPE html><html><body style="background:#000;color:#fff;font-family:sans-serif;padding:40px;text-align:center;">
            <h1 style="font-style:italic;font-weight:900;letter-spacing:-2px;color:#0D6EFD;">MEN'S WEAR</h1>
            <div style="background:#111; padding:30px; border-radius:15px; border:1px solid #222;">
                <h2 style="text-transform:uppercase; letter-spacing:2px;">Verification Code</h2>
                <div style="font-size:42px; font-weight:900; color:#0D6EFD; letter-spacing:10px; margin:20px 0;">${resetCode}</div>
                <p style="color:#666; font-size:12px;">This code expires in 10 minutes.</p>
            </div>
            </body></html>`;

        await getTransporter().sendMail({ 
            from: `"MEN'S WEAR SECURITY" <menswearofficial07@gmail.com>`, 
            to: email, subject: 'Password Reset Code', html: emailHtml 
        });

        res.json({ success: true, message: 'CODE DISPATCHED' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'EMAIL ERROR' });
    }
};

// @desc    Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ 
            email: email.toLowerCase().trim(), 
            resetPasswordCode: otp, 
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) return res.status(400).json({ success: false, message: 'INVALID OR EXPIRED CODE' });
        
        user.password = newPassword;
        user.resetPasswordCode = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        
        res.json({ success: true, message: 'PASSWORD SECURED' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'RESET ERROR' });
    }
};

exports.syncCart = async (req, res) => {
    try {
        const { cartItems } = req.body;
        const user = await User.findById(req.user.id);
        user.cart = cartItems; 
        await user.save();
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ message: "Cart sync failed" }); }
};

exports.addPaymentMethod = async (req, res) => {
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
    try {
        const { address } = req.body;
        const user = await User.findById(req.user.id);
        user.shippingAddress = { address };
        await user.save();
        res.status(200).json({ success: true, message: "Address updated" });
    } catch (error) { res.status(500).json({ success: false, message: "Address update failed" }); }
};

// --- NEWSLETTER SYSTEM (BIG BRAND UI) ---

exports.subscribeEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "EMAIL REQUIRED" });

        const emailLower = email.toLowerCase().trim();
        const existingSub = await Subscriber.findOne({ email: emailLower });
        if (existingSub) return res.status(400).json({ message: "ALREADY SUBSCRIBED" });

        await Subscriber.create({ email: emailLower });

        const newsletterHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica', Arial, sans-serif; }
                .hero { 
                    background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000');
                    background-size: cover; background-position: center; padding: 100px 20px; text-align: center; border-bottom: 5px solid #0D6EFD;
                }
                .hero h1 { color: #ffffff; font-size: 45px; margin: 0; text-transform: uppercase; letter-spacing: -2px; font-weight: 900; font-style: italic; }
                .content { padding: 50px; text-align: center; background: #000; color: #fff; }
                .btn {
                    display: inline-block; background-color: #0D6EFD; color: #ffffff !important; padding: 18px 45px; 
                    text-decoration: none; font-size: 14px; font-weight: 900; text-transform: uppercase; border-radius: 4px;
                }
            </style>
        </head>
        <body>
            <div class="hero">
                <h1>MEN'S WEAR</h1>
                <p style="color:#0D6EFD; letter-spacing:5px; text-transform:uppercase; font-size:11px; margin-top:10px;">The Inner Circle</p>
            </div>
            <div class="content">
                <h2 style="letter-spacing:2px; text-transform:uppercase;">Welcome to the Movement</h2>
                <p style="color:#888; line-height:1.8; max-width:400px; margin:0 auto;">You're now on the list. Get ready for exclusive early access to drops and premium apparel updates.</p>
                <br><br>
                <a href="http://localhost:3000/shop" class="btn">EXPLORE SHOP</a>
                <p style="color:#444; font-size:10px; margin-top:40px;">© 2025 MEN'S WEAR OFFICIAL | GLOBAL APPAREL</p>
            </div>
        </body>
        </html>`;

        const transporter = getTransporter();

        await transporter.sendMail({
            from: `"MEN'S WEAR" <menswearofficial07@gmail.com>`,
            to: emailLower,
            subject: 'WELCOME TO THE MOVEMENT',
            html: newsletterHtml
        });

        await transporter.sendMail({
            from: `"System Alert" <menswearofficial07@gmail.com>`,
            to: 'menswearofficial07@gmail.com',
            subject: '🚨 NEW SUBSCRIBER',
            text: `New user joined the newsletter: ${emailLower}`
        });

        res.status(201).json({ message: "JOINED SUCCESSFULLY" });
    } catch (err) {
        res.status(500).json({ message: "SYSTEM ERROR" });
    }
};

exports.getSubscribers = async (req, res) => {
    try {
        const data = await Subscriber.find().sort({ createdAt: -1 });
        res.status(200).json(data);
    } catch (err) { res.status(500).json([]); }
};

exports.handleInquiry = async (req, res) => {
    try {
        const { item, details, quantity, unit, submittedBy } = req.body;

        const newInquiry = await Inquiry.create({
            item,
            details,
            quantity,
            unit,
            submittedBy
        });

        const adminEmailHtml = `
            <!DOCTYPE html>
            <html>
            <body style="background:#f4f4f4; font-family:sans-serif; padding:20px;">
                <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:20px; overflow:hidden; border:2px solid #000; box-shadow: 10px 10px 0px #0099ff;">
                    <div style="background:#000; color:#0099ff; padding:30px; text-align:center;">
                        <h1 style="margin:0; font-style:italic; font-weight:900; letter-spacing:-2px; color:#0099ff;">NEW INQUIRY ALERT</h1>
                        <p style="color:#fff; letter-spacing:3px; font-size:10px; margin-top:5px; text-transform:uppercase;">Mens Wear | Global Sourcing</p>
                    </div>
                    <div style="padding:30px;">
                        <p style="text-transform:uppercase; font-weight:bold; color:#666; font-size:12px; margin-bottom:5px;">Product Requested:</p>
                        <h2 style="color:#000; margin-top:0; font-size:24px; text-transform:uppercase;">${item}</h2>
                        
                        <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">
                        
                        <div style="color:#333; font-size:14px; line-height:1.6;">
                            <p><strong>Quantity:</strong> ${quantity} ${unit}</p>
                            <p><strong>From:</strong> <span style="color:#0099ff;">${submittedBy}</span></p>
                            <p style="background:#f9f9f9; padding:15px; border-radius:10px; border-left:4px solid #0099ff;"><strong>Details:</strong><br>${details}</p>
                        </div>
                    <div style="background:#000; padding:15px; text-align:center; color:#555; font-size:10px; font-weight:bold;">
                        AUTO-GENERATED BY INQUIRY SYSTEM v2.0
                    </div>
                </div>
            </body>
            </html>
        `;

        await getTransporter().sendMail({
            from: `"INQUIRY SYSTEM" <menswearofficial07@gmail.com>`,
            replyTo: submittedBy, // This allows you to reply directly to the user
            to: 'menswearofficial07@gmail.com',
            subject: `🚨 NEW INQUIRY: ${item} from ${submittedBy}`,
            html: adminEmailHtml
        });

        res.status(201).json({ success: true, message: "INQUIRY DISPATCHED SUCCESSFULLY" });

    } catch (error) {
        console.error("Inquiry Error:", error);
        res.status(500).json({ success: false, message: "SYSTEM FAILURE DURING TRANSMISSION" });
    }
};
// --- USER DELETION WITH EMAIL ALERTS ---

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "USER NOT FOUND" });

        const userEmail = user.email;
        const userName = user.name;

        // 1. Send Farewell Email to User
        const farewellHtml = `
            <body style="background:#000; color:#fff; font-family:sans-serif; padding:40px; text-align:center;">
                <h1 style="color:#ff4444; font-style:italic;">ACCOUNT TERMINATED</h1>
                <p>Hello ${userName}, your account has been successfully removed from our elite database.</p>
                <p style="color:#666;">We're sad to see you go. Mission Complete.</p>
            </body>`;

        await getTransporter().sendMail({
            from: `"MEN'S WEAR" <menswearofficial07@gmail.com>`,
            to: userEmail,
            subject: 'ACCOUNT DELETED SUCCESSFULLY',
            html: farewellHtml
        });

        // 2. Send Alert to Admin
        await getTransporter().sendMail({
            from: `"SYSTEM ALERT" <menswearofficial07@gmail.com>`,
            to: 'menswearofficial07@gmail.com',
            subject: '🚨 USER LEFT THE MOVEMENT',
            text: `User ${userName} (${userEmail}) has deleted their account.`
        });

        // 3. Delete from DB
        await User.findByIdAndDelete(req.user.id);

        res.status(200).json({ success: true, message: "ACCOUNT DELETED" });
    } catch (error) {
        res.status(500).json({ success: false, message: "DELETION ERROR" });
    }
};

// Fix: Update getMe to return user object directly like your frontend expects
exports.getMe = async (req, res) => {
    try {
        if (!req.user) return res.status(404).json({ success: false, message: "User not found" });
        // Sending req.user directly because your frontend uses data.name, not data.user.name
        res.status(200).json(req.user); 
    } catch (error) { res.status(500).json({ message: "Server Error" }); }
};
// --- UPDATE PROFILE (For Edit Option) ---
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.gender = req.body.gender || user.gender;
            
            const updatedUser = await user.save();
            res.json({
                success: true,
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                gender: updatedUser.gender,
                isAdmin: updatedUser.isAdmin
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Update Failed" });
    }
};
