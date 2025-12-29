const nodemailer = require('nodemailer');
const Inquiry = require('../models/Inquires'); 
const connectDB = require('../config/db');

const getTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: { 
            user: 'menswearofficial07@gmail.com', 
            pass: process.env.EMAIL_PASS // <--- CHECK THIS IN .ENV
        }
    });
};

exports.submitContact = async (req, res) => {
    try {
        await connectDB();
    } catch (dbErr) {
        console.error("DB Connection Failed");
    }

    try {
        // 1. Destructure directly from req.body to avoid undefined errors
        const { name, email, subject, message } = req.body;

        // 2. Strict Validation
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide Name, Email and Message." 
            });
        }

        // 3. Save to DB first (Taake record miss na ho)
        let savedInquiry;
        try {
            savedInquiry = await Inquiry.create({
                item: subject || "General Contact",
                details: message,
                submittedBy: email
            });
        } catch (dbError) {
            console.error("Inquiry Save Error:", dbError.message);
            // Agar DB fail ho tab bhi process chalne dein
        }

        // 4. Email Logic in a Try-Catch (Taake email fail hone se 500 error na aaye)
        try {
            const transporter = getTransporter();
            
            const adminMailOptions = {
                from: `"MENSWEAR SYSTEM" <menswearofficial07@gmail.com>`, 
                to: 'menswearofficial07@gmail.com',
                replyTo: email,
                subject: `🚨 NEW QUERY: ${subject || 'General Inquiry'}`,
                html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`
            };

            const userMailOptions = {
                from: `"MENSWEAR OFFICIAL" <menswearofficial07@gmail.com>`,
                to: email,
                subject: 'Support Ticket Received',
                html: `<h1>Hello ${name}</h1><p>We have received your message.</p>`
            };

            await transporter.sendMail(adminMailOptions);
            await transporter.sendMail(userMailOptions);

        } catch (mailError) {
            console.error("SMTP/Nodemailer Error:", mailError.message);
            // Yahan hum return nahi kar rahe, taake user ko success message mil jaye kyunki DB mein save ho chuka hai.
        }

        // 5. Success Response
        return res.status(200).json({ 
            success: true, 
            message: "MESSAGE RECEIVED. OUR TEAM WILL RESPOND SHORTLY." 
        });

    } catch (error) {
        console.error("FATAL_CONTROLLER_ERROR:", error);
        return res.status(500).json({ 
            success: false, 
            message: "SERVER ERROR: SOMETHING WENT WRONG" 
        });
    }
};