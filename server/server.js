require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

const Order = require('./models/Order');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const contactRoute = require('./routes/Contact');

const app = express();

// --- Middlewares ---
app.use(cors({
    origin: ["https://menswearbrand.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use('/Products-Data', express.static(path.join(__dirname, 'Products-Data')));

// --- Nodemailer Setup ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});

/**
 * @sendCancellationEmail
 * Sends alert to Admin when a user cancels an order
 */
const sendCancellationEmail = async (orderData) => {
    const adminEmail = "menswearofficial07@gmail.com";
    const { customOrderId, totalPrice, shippingAddress, email } = orderData;

    // Currency check for Cancellation Email
    const isDecimal = totalPrice.toString().includes('.');
    const activeSymbol = isDecimal ? '$' : 'Rs ';

    const cancelHtml = `
        <div style="font-family: sans-serif; padding: 20px; background:#fff1f2; border: 2px solid #e11d48; border-radius: 12px;">
            <h2 style="color: #e11d48; margin-top: 0;">⚠️ ORDER TERMINATED BY USER</h2>
            <p><strong>Order ID:</strong> #${customOrderId}</p>
            <p><strong>Customer Name:</strong> ${shippingAddress.firstName} ${shippingAddress.lastName}</p>
            <p><strong>Customer Email:</strong> ${email || orderData.customerEmail}</p>
            <p><strong>Lost Revenue:</strong> <span style="font-size:18px; font-weight:bold; color: #e11d48;">${activeSymbol}${totalPrice}</span></p>
            <hr style="border: 0; border-top: 1px solid #fda4af; margin: 20px 0;">
            <p style="font-size: 13px; color: #666;">This order was cancelled from the "My Orders" dashboard.</p>
        </div>`;

    try {
        await transporter.sendMail({
            from: `"MW ALERTS" <${process.env.EMAIL_USER}>`,
            to: adminEmail,
            subject: `🚫 Order Cancelled: #${customOrderId}`,
            html: cancelHtml
        });
    } catch (err) {
        console.error("❌ Cancellation Email Error:", err.message);
    }
};

/**
 * @sendOrderEmails
 * Sends confirmation to User and Sale Alert to Admin
 */
const sendOrderEmails = async (orderData) => {
    const recipientEmail = orderData.email || orderData.customerEmail || orderData.shippingAddress?.email;
    
    if (!recipientEmail) {
        console.error("❌ Email Error: No recipient email found.");
        return;
    }

    const { 
        customOrderId, orderItems, totalPrice, 
        shippingAddress, phone, expectedDelivery 
    } = orderData;
    
    // --- LOGIC: DECIMAL MEIN HAI TU USD ($), WARNA RS ---
    // Hum totalPrice ko string mein convert kar k check kar rhay hain k "." hai ya nahi
    const isDecimal = totalPrice.toString().includes('.');
    const activeSymbol = isDecimal ? '$' : 'Rs ';

    const logoPath = path.resolve(__dirname, 'public', 'logo4.png'); 
    const logoExists = fs.existsSync(logoPath);
    const displayPaymentMethod = orderData.paymentMethod || "Not Specified";

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <body style="background-color: #020617; margin: 0; padding: 20px; font-family: 'Helvetica', Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #050a14; border: 1px solid #00d2ff; border-radius:15px; overflow:hidden; color: #f8fafc;">
            <tr>
                <td align="center" style="padding: 30px; background: #0f172a; border-bottom: 2px solid #00d2ff;">
                    ${logoExists ? `<img src="cid:brandlogo" width="80">` : `<h1 style="color:#00d2ff; margin:0; letter-spacing:5px;">MEN'S WEAR</h1>`}
                </td>
            </tr>
            <tr>
                <td style="padding: 40px 30px;">
                    <h2 style="color: #00d2ff; text-transform: uppercase; font-style: italic; margin-top: 0;">Thanks for your order!</h2>
                    <p style="color: #94a3b8; font-size: 15px;">Hello <b>${shippingAddress.firstName}</b>, your order is confirmed and currently being processed.</p>
                    
                    <div style="margin: 25px 0; border-left: 4px solid #00d2ff; padding-left: 15px; background: rgba(0, 210, 255, 0.05); padding-top: 10px; padding-bottom: 10px;">
                        <p style="margin: 5px 0;"><strong>Order ID:</strong> #${customOrderId}</p>
                        <p style="margin: 5px 0;"><strong>Payment Method:</strong> <span style="color:#00d2ff; text-transform: uppercase;">${displayPaymentMethod}</span></p>
                        <p style="margin: 5px 0; color: #00d2ff;"><strong>Expected Delivery:</strong> ${expectedDelivery || '3-5 Business Days'}</p>
                    </div>

                    <table width="100%" style="color: #f8fafc; border-collapse: collapse; margin: 20px 0; background: #0f172a; border-radius: 8px;">
                        <thead>
                            <tr style="border-bottom: 1px solid #1e293b;">
                                <th align="left" style="padding: 15px; font-size:12px; color:#94a3b8;">ITEM</th>
                                <th align="right" style="padding: 15px; font-size:12px; color:#94a3b8;">PRICE</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderItems.map(item => `
                                <tr style="border-bottom: 1px solid #ffffff05;">
                                    <td style="padding: 12px 15px;">${item.name} <span style="color:#00d2ff;">x${item.qty || item.quantity}</span></td>
                                    <td align="right" style="padding: 12px 15px;">${activeSymbol}${item.price}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style="padding: 20px 15px; font-size: 16px; font-weight: bold;">TOTAL</td>
                                <td align="right" style="padding: 20px 15px; font-size: 22px; font-weight: 900; color: #00d2ff; font-style: italic;">${activeSymbol}${totalPrice}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div style="font-size: 13px; color: #94a3b8; line-height: 1.6; border-top: 1px solid #1e293b; padding-top: 20px;">
                        <strong style="color: white; text-transform: uppercase;">Shipping To:</strong><br>
                        ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
                        ${shippingAddress.address}, ${shippingAddress.city}<br>
                        Phone: ${phone}
                    </div>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 20px; background: #000; font-size: 10px; color: #475569; letter-spacing: 2px;">
                    © 2025 MEN'S WEAR OFFICIAL | PREMIUM QUALITY
                </td>
            </tr>
        </table>
    </body>
    </html>`;

    const adminHtml = `
    <div style="font-family: sans-serif; padding: 20px; background:#f4f4f4; color: #333;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; border-top: 5px solid #00d2ff;">
            <h2 style="color: #00d2ff; margin-top: 0;">💰 NEW SALE ALERT!</h2>
            <p><strong>Order ID:</strong> #${customOrderId}</p>
            <p><strong>Customer:</strong> ${shippingAddress.firstName} ${shippingAddress.lastName} (${recipientEmail})</p>
            <p><strong>Payment Method:</strong> <span style="color: #e11d48; font-weight: bold;">${displayPaymentMethod.toUpperCase()}</span></p>
            <p><strong>Total Bill:</strong> <span style="font-size:24px; font-weight:bold; color: #000;">${activeSymbol}${totalPrice}</span></p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">Check admin dashboard for details.</p>
        </div>
    </div>`;

    try {
        await transporter.sendMail({
            from: `"MEN'S WEAR" <${process.env.EMAIL_USER}>`,
            to: recipientEmail,
            subject: `Order Confirmed: #${customOrderId}`,
            html: emailHtml,
            attachments: logoExists ? [{ filename: 'logo.png', path: logoPath, cid: 'brandlogo' }] : []
        });

        await transporter.sendMail({
            from: `"MW SALES" <${process.env.EMAIL_USER}>`,
            to: "menswearofficial07@gmail.com",
            subject: `🔥 New Order Recieved: #${customOrderId}`,
            html: adminHtml
        });
    } catch (err) {
        console.error("❌ Email Error:", err.message);
    }
};

// --- ROUTES ---

// 1. Cancel Order
app.put('/api/orders/cancel-order/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order Not Found" });
        order.status = "Cancelled";
        await order.save();
        await sendCancellationEmail(order.toObject());
        res.status(200).json({ success: true, message: "Order Cancelled Successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Stripe Payment Verification
app.get('/api/orders/verify', async (req, res) => {
    try {
        const { session_id, id } = req.query; // 'id' bhi lein frontend se
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const orderIdFromStripe = session.metadata?.customOrderId || id; 
        const order = await Order.findOne({ customOrderId: orderIdFromStripe })

        if (order) {
            if (!order.isPaid) {
                order.isPaid = true;
                await order.save();
                await sendOrderEmails(order.toObject());
            }
            res.status(200).json({ success: true, order });
        } else { res.status(404).json({ error: "Order not found" }); }
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. Create Order (COD)
app.post('/api/orders', async (req, res) => {
    try {
        const d = req.body;
        // Ensuring email is explicitly handled if sent separately
        const emailToSave = d.email || d.customerEmail;
        const newOrder = new Order({ ...d, email: emailToSave, isPaid: false });
        const savedOrder = await newOrder.save();

        if (d.paymentMethod === 'COD' || d.paymentMethod === 'Cash on Delivery') {
          await sendOrderEmails(savedOrder.toObject());
        }
        res.status(200).json({ success: true, order: savedOrder });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. Get My Orders
app.get('/api/orders/myorders-by-email/:email', async (req, res) => {
    try {
        const orders = await Order.find({ email: req.params.email }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 5. Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { items, orderId, currency } = req.body;
        const lineItems = items.map((item) => ({
            price_data: {
                currency: currency || 'pkr',
                product_data: { name: item.name },
                unit_amount: Math.round(Number(item.price) * 100), 
            },
            quantity: item.quantity || item.qty || 1,
        }));
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/checkout`,
            metadata: { customOrderId: orderId }
        });
        res.status(200).json({ url: session.url });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- EXTERNAL ROUTES ---
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/orders', orderRoutes); 
app.use('/api/products', productRoutes); 
app.use('/api/contact', contactRoute);

// --- DB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => app.listen(5000, () => console.log("🚀 SERVER RUNNING ON PORT 5000")))
    .catch(err => console.error("MongoDB Error:", err));

module.exports = app;