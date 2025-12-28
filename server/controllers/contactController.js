const nodemailer = require('nodemailer');

/**
 * HELPER: CONFIGURE MAIL TRANSPORTER
 * Uses Gmail SMTP with secure SSL connection
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
 * @desc    Submit Contact Form & Send Email to Admin and User
 * @route   POST /api/contact
 * @access  Public
 */
exports.submitContact = async (req, res) => {
    try {
        // 1. EXTRACT DATA
        // Fetches from req.user (if logged in) or req.body (for guest users)
        const senderName = req.user ? req.user.name : req.body.name;
        const senderEmail = req.user ? req.user.email : req.body.email;
        const { subject, message } = req.body;

        // 2. DATA VALIDATION
        if (!senderName || !senderEmail || !message) {
            return res.status(400).json({ 
                success: false, 
                message: "VALIDATION FAILED: NAME, EMAIL, AND MESSAGE ARE REQUIRED" 
            });
        }

        const transporter = getTransporter();

        // 3. ADMIN NOTIFICATION PAYLOAD (Sent to your inbox)
        const adminMailOptions = {
            from: `"${senderName.toUpperCase()}" <menswearofficial07@gmail.com>`, 
            to: 'menswearofficial07@gmail.com',
            replyTo: senderEmail, // This allows you to reply directly to the customer
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

        // 4. USER CONFIRMATION PAYLOAD (Auto-reply sent to customer)
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
                        In the fast-paced world of fashion, we don't believe in making you wait. Your inquiry has been successfully logged into our system.
                    </p>
                    
                    <div style="background: #0a0a0a; padding: 15px 25px; display: inline-block; border-radius: 12px; border: 1px solid #0ea5e9; margin-top: 20px;">
                        <p style="margin: 0; font-size: 11px; color: #0ea5e9; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase;">
                            Ticket Status: <span style="color: #fff;">IN-REVIEW</span>
                        </p>
                    </div>
                </div>
            `
        };

        // 5. EXECUTE DUAL TRANSMISSION
        // Promise.all speeds up the process by sending both emails at the same time
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