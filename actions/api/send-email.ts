"use server";

import nodemailer from "nodemailer";

export interface SendEmailParams {
  orderId?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    country: string;
    zip: string;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  totals: {
    subtotal: number;
    shipping: number;
    taxes: number;
    grandTotal: number;
  };
}

export async function sendOrderConfirmationEmail(params: SendEmailParams) {
  const { customer, items, totals, orderId, shipping } = params;

  if (!customer?.email || !items || !totals) {
    throw new Error("Missing required fields");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true" || false, // false for 587, true for 465
    auth: {
      user: process.env.SMTP_USER, // Your Gmail address
      pass: process.env.SMTP_PASSWORD, // Your Gmail App Password
    },
  });

  // Format order items for invoice-style HTML display
  const itemsListHtml = items
    .map((item, index) => {
      const itemTotal = item.price * item.quantity;
      const productName = `${item.name} x${item.quantity}`;
      return `
                    <tr class="invoice-row">
                      <td class="invoice-item">${productName}</td>
                      <td class="invoice-price">$${itemTotal.toLocaleString()}</td>
                    </tr>
                    ${index < items.length - 1 ? '<tr><td colspan="3" class="invoice-divider">-</td></tr>' : ''}
                  `;
    })
    .join("");

  // Format order items for plain text version
  const itemsList = items
    .map((item) => {
      const itemTotal = item.price * item.quantity;
      const productName = `${item.name} x${item.quantity}`;
      return `${productName} $${itemTotal.toLocaleString()}`;
    })
    .join("\n");

  // Email HTML template with Neo-Brutalism style
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.5;
            color: #000;
            background-color: #ffffff;
            padding: 20px;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 4px solid #000;
            width: 100%;
          }
          @media only screen and (max-width: 600px) {
            body {
              padding: 10px;
            }
            .container {
              max-width: 100%;
              border: 3px solid #000;
            }
            .header {
              padding: 20px 15px;
            }
            .header h1 {
              font-size: 24px;
            }
            .header .greeting {
              font-size: 18px;
            }
            .content {
              padding: 20px 15px;
            }
            .welcome-section {
              padding: 12px 20px;
            }
            .order-details {
              padding: 20px 15px;
              margin: 20px 0;
              border: 3px solid #000;
            }
            .invoice-table {
              font-size: 12px;
              border: 3px solid #000;
              display: block;
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
            }
            .invoice-header th {
              padding: 10px 8px;
              font-size: 11px;
            }
            .invoice-item,
            .invoice-dashes,
            .invoice-price {
              padding: 10px 8px;
              font-size: 12px;
            }
            .invoice-dashes {
              font-size: 10px;
              min-width: 50px;
            }
            .footer {
              padding: 20px 15px;
            }
            .cta-button {
              padding: 12px 20px !important;
              font-size: 14px !important;
            }
          }
          .header {
            background-color: #d87d4a;
            color: #000;
            padding: 30px 40px;
            text-align: center;
            border-bottom: 4px solid #000;
          }
          .header h1 {
            font-size: 36px;
            margin-bottom: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .header .greeting {
            font-size: 22px;
            margin-bottom: 15px;
            font-weight: 700;
          }
          .header .order-number {
            background-color: #000;
            color: #d87d4a;
            padding: 10px 20px;
            display: inline-block;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            border: 3px solid #000;
          }
          .content {
            background-color: #ffffff;
          }
          .welcome-section {
            background-color: #ffffff;
            padding: 15px 40px;
            margin-bottom: 30px;
            border: 4px solid #d87d4a;
            width: 100%;
          }
          .welcome-section .fun-text {
            font-size: 18px;
            color: #d87d4a;
            font-weight: 700;
            margin-bottom: 10px;
            text-transform: uppercase;
          }
          .welcome-section .boss-text {
            font-size: 16px;
            color: #000;
            margin-bottom: 8px;
            font-weight: 600;
          }
          .welcome-section .yute-text {
            font-size: 14px;
            color: #000;
            font-weight: 600;
          }
          .order-details {
            background-color: #ffffff;
            margin: 30px 0;
            border: 4px solid #000;
          }
          .order-details h2 {
            color: #000;
            font-size: 24px;
            margin-bottom: 25px;
            font-weight: 900;
            text-transform: uppercase;
            padding-bottom: 15px;
            border-bottom: 4px solid #000;
          }
          .shipping-info {
            background-color: #ffffff;
            padding: 20px;
            margin-bottom: 25px;
            border: 3px solid #d87d4a;
          }
          .shipping-info strong {
            color: #000;
            display: block;
            margin-bottom: 12px;
            font-size: 14px;
            text-transform: uppercase;
            font-weight: 900;
            letter-spacing: 1px;
          }
          .shipping-info div {
            color: #000;
            line-height: 1.8;
            font-weight: 500;
          }
          .invoice-section {
            margin-top: 25px;
          }
          .invoice-section h3 {
            color: #000;
            font-size: 18px;
            margin-bottom: 20px;
            font-weight: 900;
            text-transform: uppercase;
          }
          .invoice-table {
            width: 100%;
            max-width: 100%;
            border-collapse: collapse;
            font-family: 'Courier New', monospace;
            font-size: 15px;
            border: 4px solid #000;
            background-color: #ffffff;
            table-layout: fixed;
          }
          .invoice-header {
            background-color: #d87d4a;
            color: #000;
            font-weight: 900;
            text-transform: uppercase;
            border-bottom: 4px solid #000;
          }
          .invoice-header th {
            text-align: left;
            padding: 15px 20px;
            border-right: 4px solid #000;
            font-size: 14px;
            letter-spacing: 1px;
          }
          .invoice-header th:first-child {
            width: 40%;
          }
          .invoice-header th:nth-child(2) {
            width: 35%;
          }
          .invoice-header th:last-child {
            border-right: none;
            text-align: right;
            width: 25%;
          }
          .invoice-row {
            border-bottom: 2px solid #000;
          }
          .invoice-item {
            padding: 15px 20px;
            font-weight: 700;
            color: #000;
            border-right: 2px solid #000;
          }
          .invoice-price {
            padding: 15px 20px;
            text-align: right;
            font-weight: 900;
            color: #000;
            font-size: 16px;
          }
          .invoice-divider {
            padding: 10px;
            text-align: center;
            color: #000;
            font-weight: 900;
            font-size: 18px;
            border-bottom: 2px solid #000;
          }
          .invoice-totals {
            margin-top: 20px;
            padding: 20px;
            background-color: #000;
            color: #ffffff;
            border: 4px solid #000;
          }
          .invoice-totals p {
            margin: 12px 0;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 2px solid #333;
          }
          .invoice-totals p:last-of-type {
            border-bottom: none;
          }
          .invoice-totals .grand-total {
            font-size: 28px;
            font-weight: 900;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 4px solid #d87d4a;
            color: #d87d4a;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .cta-section {
            text-align: center;
            padding: 30px 40px;
            background-color: #ffffff;
            border-top: 4px solid #000;
          }
          .cta-button {
            display: inline-block;
            background-color: #d87d4a;
            color: #000;
            padding: 15px 40px;
            text-decoration: none;
            font-weight: 900;
            font-size: 16px;
            text-transform: uppercase;
            border: 4px solid #000;
            letter-spacing: 1px;
            transition: all 0.2s;
          }
          .cta-button:hover {
            background-color: #000;
            color: #d87d4a;
          }
          .footer {
            text-align: center;
            padding: 25px 40px;
            color: #000;
            font-size: 13px;
            background-color: #ffffff;
            border-top: 4px solid #000;
            font-weight: 600;
          }
          .footer p {
            margin: 8px 0;
          }
          .emoji {
            font-size: 20px;
            margin-right: 6px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="greeting">Hiiiii ${customer.name}! 👋</div>
            <h1>Your Order is Confirmed!</h1>
            <div class="order-number">Order #${orderId || "N/A"}</div>
          </div>
          <div class="content">
            <div class="welcome-section">
              <div class="fun-text">✨ Look at you, making purchases like a boss! ✨</div>
              <div class="boss-text">We've received your order and we're already prepping it for shipment! 🚀</div>
              <div class="yute-text">Way to go, you sexy yute! 😎</div>
            </div>
            
            <div class="order-details">
              <h2><span class="emoji">📦</span> Order Details</h2>
              
              <div class="shipping-info">
                <strong>📍 Shipping Address:</strong>
                <div>
                  ${customer.name}<br>
                  ${shipping?.address || "N/A"}<br>
                  ${shipping?.city || "N/A"}, ${shipping?.country || "N/A"} ${shipping?.zip || "N/A"}
                </div>
              </div>
              
              <div class="invoice-section">
                <h3><span class="emoji">🛍️</span> Invoice</h3>
                <table class="invoice-table">
                  <thead class="invoice-header">
                    <tr>
                      <th>Product</th>
                      <th></th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
${itemsListHtml}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="invoice-totals">
              <p><span>Subtotal:</span> <span>$${totals.subtotal.toLocaleString()}</span></p>
              <p><span>Shipping:</span> <span>$${totals.shipping.toLocaleString()}</span></p>
              <p><span>Tax:</span> <span>$${totals.taxes.toFixed(2)}</span></p>
              <div class="grand-total">
                <span>Grand Total: $${totals.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div class="cta-section">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://audiophile.com'}/orders/${orderId}" class="cta-button">View Your Order</a>
          </div>
          <div class="footer">
            <p>💬 Have questions? We're here for you!</p>
            <p>📧 support@audiophile.com</p>
            <p style="margin-top: 15px;">You'll receive another email when your order ships! 🚚</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Plain text version
  const emailText = `
Hiiiii ${customer.name}! 👋

🎉 Your Order is Confirmed!

Order #${orderId || "N/A"}

✨ Look at you, making purchases like a boss! ✨

We've received your order and we're already prepping it for shipment! 🚀
Way to go, you sexy yute! 😎

📦 Order Details:

📍 Shipping Address:
${customer.name}
${shipping?.address || "N/A"}
${shipping?.city || "N/A"}, ${shipping?.country || "N/A"} ${shipping?.zip || "N/A"}

🛍️ Items You Snagged:
${itemsList}

💰 Payment Summary:
Subtotal: $${totals.subtotal.toLocaleString()}
Shipping: $${totals.shipping.toLocaleString()}
Tax: $${totals.taxes.toFixed(2)}
Grand Total: $${totals.grandTotal.toLocaleString()}

💬 Have questions? We're here for you!
📧 support@audiophile.com

View Your Order: ${process.env.NEXT_PUBLIC_APP_URL || 'https://audiophile.com'}/orders/${orderId}

You'll receive another email when your order ships! 🚚
  `;

  // Send email from your Gmail account
  const fromEmail = process.env.SMTP_USER;
  const fromName = process.env.SMTP_FROM_NAME || "Audiophile";
  
  if (!fromEmail) {
    throw new Error("SMTP_USER environment variable is required (your Gmail address)");
  }

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: customer.email,
    subject: `Order Confirmation - Order #${orderId || "N/A"}`,
    text: emailText,
    html: emailHtml,
  });

  return {
    success: true,
    messageId: info.messageId,
  };
}

