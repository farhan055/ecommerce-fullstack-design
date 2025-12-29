const nodemailer = require('nodemailer');
const Inquiry = require('../models/Inquires'); // Database mein save karne ke liye
const connectDB = require('../config/db');

/**
 * HELPER: CONFIGURE MAIL TRANSPORTER
 */
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

/**
 * @desc    Submit Contact Form & Send Email
 */
exports.submitContact = async (req, res) => {
    // VERCEL FIX: Har request se pehle connection ensure karein
    await connectDB();

    try {
        const senderName = req.user ? req.user.name : req.body.name;
        const senderEmail = req.user ? req.user.email : req.body.email;
        const { subject, message } = req.body;

        // DATA VALIDATION
        if (!senderName || !senderEmail || !message) {
            return res.status(400).json({ 
                success: false, 
                message: "VALIDATION FAILED: NAME, EMAIL, AND MESSAGE ARE REQUIRED" 
            });
        }

        // OPTIONAL: Database mein record save karein (Best Practice for E-commerce)
        await Inquiry.create({
            item: subject || "General Contact",
            details: message,
            submittedBy: senderEmail
        });

        const transporter = getTransporter();

        // ADMIN MAIL OPTIONS
        const adminMailOptions = {
            from: `"${senderName.toUpperCase()}" <menswearofficial07@gmail.com>`, 
            to: 'menswearofficial07@gmail.com',
            replyTo: senderEmail,
            subject: `🚨 NEW QUERY: ${subject || 'General Inquiry'}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 2px solid #0ea5e9; border-radius: 10px;">
                    <h2 style="color: #0ea5e9; text-transform: uppercase;">New Support Request</h2>
                    <hr>
                    <p><strong>Customer Name:</strong> ${senderName}</p>
                    <p><strong>Customer Email:</strong> ${senderEmail}</p>
                    <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
                    <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin-top: 10px; border-left: 4px solid #0ea5e9;">
                        <strong>Message:</strong><br>${message}
                    </div>
                </div>
            `
        };

        // USER MAIL OPTIONS
        const userMailOptions = {
            from: `"MENSWEAR OFFICIAL" <menswearofficial07@gmail.com>`,
            to: senderEmail,
            subject: 'Support Ticket Received - MENSWEAR Official',
            html: `
                <div style="font-family: 'Helvetica', Arial, sans-serif; text-align: center; padding: 50px; background-color: #000; color: #fff; border-radius: 24px; border: 1px solid #1a1a1a;">
                    <h1 style="color: #0ea5e9; font-style: italic; letter-spacing: 4px; font-weight: 900; margin-bottom: 0;">MENSWEAR OFFICIAL</h1>
                    <p style="color: #444; font-size: 10px; letter-spacing: 2px; margin-top: 5px; text-transform: uppercase;">Premium Mens Apparel</p>
                    <div style="height: 1px; background: linear-gradient(to right, transparent, #0ea5e9, transparent); width: 70%; margin: 30px auto;"></div>
                    <p style="font-size: 20px; font-weight: bold; letter-spacing: -0.5px;">Hello <strong>${senderName}</strong>,</p>
                    <p style="color: #aaa; font-size: 15px; line-height: 1.6; max-width: 400px; margin: 0 auto;">
                        Your inquiry has been successfully logged into our system. Our team will respond shortly.
                    </p>
                    <div style="background: #0a0a0a; padding: 15px 25px; display: inline-block; border-radius: 12px; border: 1px solid #0ea5e9; margin-top: 20px;">
                        <p style="margin: 0; font-size: 11px; color: #0ea5e9; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase;">
                            Ticket Status: <span style="color: #fff;">IN-REVIEW</span>
                        </p>
                    </div>
                </div>
            `
        };

        // EXECUTE DUAL TRANSMISSION
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(userMailOptions)
        ]);

        res.status(200).json({ 
            success: true, 
            message: "MESSAGE RECEIVED. OUR TEAM WILL RESPOND SHORTLY." 
        });

    } catch (error) {
        console.error("CONTACT_CONTROLLER_ERROR:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "SERVER ERROR: UNABLE TO PROCESS CONTACT REQUEST" 
        });
    }
};