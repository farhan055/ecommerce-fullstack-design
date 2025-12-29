const Order = require('../models/Order');
const nodemailer = require('nodemailer');
// Zaroori Fix: DB connection ensure karein
const connectDB = require('../config/db').default || require('../config/db');

// USD Formatter
const formatUSD = (amount) => `USD ${parseFloat(amount).toFixed(2)}`;

// Traditional Luxury Email Template
const getEmailTemplate = (order, isAdmin = false) => {
    const { customOrderId, orderItems, totalPrice, shippingAddress, paymentMethod } = order;
    
    return `
    <div style="background-color: #f4f4f4; padding: 20px; font-family: 'Times New Roman', Times, serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0;">
            <tr>
                <td align="center" style="padding: 40px 0; background-color: #000000;">
                    <h1 style="margin: 0; color: #c5a059; font-size: 34px; letter-spacing: 5px; text-transform: uppercase;">MENSWEAR</h1>
                    <p style="color: #ffffff; font-size: 12px; letter-spacing: 2px; margin-top: 5px;">ESTABLISHED 2024</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 40px 30px;">
                    <h2 style="color: #333; text-align: center; border-bottom: 2px solid #c5a059; padding-bottom: 10px;">
                        ${isAdmin ? 'NEW ORDER NOTIFICATION' : 'ORDER CONFIRMATION'}
                    </h2>
                    <p style="font-size: 16px; color: #555;">Dear ${shippingAddress.firstName},</p>
                    <p style="font-size: 14px; color: #777; line-height: 1.6;">
                        ${isAdmin ? 'A new order has been placed on your store.' : 'Thank you for your purchase. We are preparing your order for shipment.'}
                    </p>
                    <div style="margin: 30px 0; padding: 15px; border: 1px dashed #c5a059; background-color: #fffaf0;">
                        <span style="font-weight: bold; color: #000;">Order ID:</span> #${customOrderId} <br>
                        <span style="font-weight: bold; color: #000;">Payment Method:</span> ${paymentMethod}
                    </div>
                    <table width="100%" style="border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr style="border-bottom: 1px solid #eee;">
                                <th align="left" style="padding: 10px 0; color: #333;">Product</th>
                                <th align="center" style="padding: 10px 0; color: #333;">Qty</th>
                                <th align="right" style="padding: 10px 0; color: #333;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderItems.map(item => `
                                <tr style="border-bottom: 1px solid #f9f9f9;">
                                    <td style="padding: 12px 0; color: #555;">${item.name}</td>
                                    <td align="center" style="color: #555;">${item.qty}</td>
                                    <td align="right" style="color: #000; font-weight: bold;">${formatUSD(item.price)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <table width="100%" style="margin-top: 20px; border-top: 2px solid #000; padding-top: 10px;">
                        <tr>
                            <td align="right" style="font-size: 18px; font-weight: bold; color: #000;">
                                GRAND TOTAL: <span style="color: #c5a059; font-size: 24px;">${formatUSD(totalPrice)}</span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eee;">
                    <p style="margin: 0; font-size: 14px; color: #888;">&copy; 2025 MENSWEAR OFFICIAL. All Rights Reserved.</p>
                </td>
            </tr>
        </table>
    </div>`;
};

// 1. Add Order Logic
exports.addOrderItems = async (req, res) => {
    await connectDB(); // VERCEL FIX
    const { orderItems, shippingAddress, paymentMethod, totalPrice, customerEmail, customOrderId } = req.body;
    
    try {
        const order = new Order({
            user: req.user._id,
            customOrderId,
            orderItems,
            shippingAddress,
            email: customerEmail,
            paymentMethod,
            totalPrice: Number(totalPrice),
            currencyCode: 'USD'
        });

        const createdOrder = await order.save();

        // Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { 
                user: process.env.EMAIL_USER, // Variable name should match Vercel settings
                pass: process.env.EMAIL_PASS 
            }
        });

        // Email to Customer & Admin
        await Promise.all([
            transporter.sendMail({
                from: `"MENSWEAR OFFICIAL" <${process.env.EMAIL_USER}>`,
                to: customerEmail,
                subject: `Receipt for Order #${customOrderId}`,
                html: getEmailTemplate(order, false)
            }),
            transporter.sendMail({
                from: `"STORE ALERT" <${process.env.EMAIL_USER}>`,
                to: "menswearofficial07@gmail.com",
                subject: `🚀 New Sale: #${customOrderId}`,
                html: getEmailTemplate(order, true)
            })
        ]);

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error("ORDER_ERROR:", error.message);
        res.status(500).json({ message: 'Order failed', error: error.message });
    }
};

// 2. Cancel Order
exports.cancelOrder = async (req, res) => {
    await connectDB(); // VERCEL FIX
    try {
        const order = await Order.findOne({ customOrderId: req.params.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        
        order.status = 'Cancelled';
        await order.save();
        res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Get Order By ID
exports.getOrderById = async (req, res) => {
    await connectDB(); // VERCEL FIX
    try {
        const order = await Order.findOne({ customOrderId: req.params.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};