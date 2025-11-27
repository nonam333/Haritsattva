# Razorpay Integration Guide - HaritsattvaFresh

## Overview

This guide explains how to set up and use Razorpay payment gateway integration in the HaritsattvaFresh e-commerce platform.

---

## Features Implemented

- **UPI Payments** - Primary payment method (GPay, PhonePe, Paytm, etc.)
- **Payment Verification** - Signature-based verification for security
- **Order Tracking** - Link payments to orders with status updates
- **Webhook Support** - Automatic payment status updates
- **COD Support** - Cash on Delivery option alongside UPI

---

## Prerequisites

1. **Razorpay Account** - Sign up at https://razorpay.com
2. **API Keys** - Get from https://dashboard.razorpay.com/app/keys
3. **Database** - PostgreSQL with payments table (already configured)

---

## Step 1: Get Razorpay API Credentials

### Create Razorpay Account
1. Go to https://razorpay.com
2. Click "Sign Up" and create an account
3. Complete KYC verification (required for live mode)

### Get Test Mode Keys
1. Log in to https://dashboard.razorrzp_test_Rkc5k5bl9w3R0xpay.com
2. Switch to **Test Mode** (toggle in top-left corner)
3. Go to **Settings** → **API Keys**
4. Click **Generate Test Keys**
5. Copy:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (starts with `rzp_test_`)

**IMPORTANT:** Never share your Key Secret publicly!

---

## Step 2: Configure Environment Variables

Edit your `.env` file and add:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
RAZORPAY_WEBHOOK_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
```

Replace the placeholders with your actual keys from Step 1.

---

## Step 3: Set Up Webhooks (Optional but Recommended)

Webhooks allow Razorpay to notify your server about payment events automatically.

### Local Development (using ngrok or similar)
1. Install ngrok: `npm install -g ngrok`
2. Start your server: `npm run dev`
3. In another terminal: `ngrok http 5000`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### Configure Webhook in Razorpay Dashboard
1. Go to https://dashboard.razorpay.com/app/webhooks
2. Click **Add New Webhook**
3. Enter details:
   - **Webhook URL:** `https://your-domain.com/api/webhooks/razorpay`
     - For local dev: `https://abc123.ngrok.io/api/webhooks/razorpay`
   - **Secret:** Create a random string (save this as `RAZORPAY_WEBHOOK_SECRET`)
   - **Events:** Select all payment events
4. Click **Create Webhook**

**Webhook Secret Generation:**
```bash
# Generate a random webhook secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 4: Test the Integration

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Place a Test Order
1. Go to http://localhost:5000
2. Add products to cart
3. Go to checkout
4. Fill in shipping details
5. Select **UPI** as payment method
6. Click **Place Order**

### 3. Complete Test Payment
The Razorpay checkout modal will open. Use these test credentials:

**UPI Payment (Success):**
- UPI ID: `success@razorpay`
- Click "Pay Now"

**UPI Payment (Failure):**
- UPI ID: `failure@razorpay`
- Click "Pay Now"

**Card Payment (if enabled):**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

### 4. Verify Payment
- Check browser console for logs
- Verify order status in admin panel
- Check database `payments` table

---

## How It Works

### Payment Flow

```
1. User clicks "Place Order"
   ↓
2. Backend creates order record
   ↓
3. Frontend calls /api/payments/create-order
   ↓
4. Backend creates Razorpay order
   ↓
5. Frontend opens Razorpay checkout modal
   ↓
6. User completes payment
   ↓
7. Frontend receives payment response
   ↓
8. Frontend calls /api/payments/verify
   ↓
9. Backend verifies signature
   ↓
10. Backend updates order status to "confirmed"
    ↓
11. User sees success message
```

### Database Tables

**payments table:**
```sql
CREATE TABLE payments (
  id VARCHAR PRIMARY KEY,
  order_id VARCHAR NOT NULL,
  razorpay_order_id VARCHAR UNIQUE,
  razorpay_payment_id VARCHAR UNIQUE,
  razorpay_signature VARCHAR,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(50) DEFAULT 'created',
  payment_method VARCHAR(50),
  payment_details JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Payment Statuses
- `created` - Razorpay order created, awaiting payment
- `authorized` - Payment authorized but not captured
- `captured` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

### Order Payment Statuses
- `pending_payment` - Order created, payment not received
- `paid` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

---

## API Endpoints

### Create Payment Order
```http
POST /api/payments/create-order
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "orderId": "order_123",
  "amount": "499.00"
}
```

**Response:**
```json
{
  "razorpayOrderId": "order_MXxxx",
  "key_id": "rzp_test_xxx",
  "amount": 49900,
  "currency": "INR"
}
```

### Verify Payment
```http
POST /api/payments/verify
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "razorpay_order_id": "order_MXxxx",
  "razorpay_payment_id": "pay_MXxxx",
  "razorpay_signature": "signature_xxx",
  "orderId": "order_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

### Webhook Handler
```http
POST /api/webhooks/razorpay
X-Razorpay-Signature: <webhook-signature>
Content-Type: application/json

{
  "event": "payment.captured",
  "payload": { ... }
}
```

---

## Security Best Practices

### 1. Protect API Keys
- Never commit `.env` file to Git
- Use different keys for test/live mode
- Rotate keys regularly

### 2. Verify Signatures
- Always verify payment signatures on backend
- Never trust client-side payment data
- Use webhook signature verification

### 3. Validate Amounts
```javascript
// Backend validation
const orderTotal = parseFloat(order.total);
const paymentAmount = parseFloat(amount);

if (orderTotal !== paymentAmount) {
  throw new Error("Amount mismatch");
}
```

### 4. HTTPS Only
- Use HTTPS in production
- Configure webhooks with HTTPS URLs
- Enable SSL certificate validation

---

## Going Live

### 1. Complete KYC
- Submit business documents
- Bank account verification
- Get live mode activated

### 2. Switch to Live Mode
1. Go to Razorpay Dashboard
2. Switch to **Live Mode**
3. Generate **Live API Keys**
4. Update `.env` with live keys:

```env
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
```

### 3. Update Webhooks
- Create new webhook with production URL
- Update `RAZORPAY_WEBHOOK_SECRET` in `.env`

### 4. Enable Additional Payment Methods
```javascript
// In useRazorpay.ts
method: {
  upi: true,
  card: true,        // Enable cards
  netbanking: true,  // Enable net banking
  wallet: true,      // Enable wallets
}
```

### 5. Configure Settlement
- Set up bank account in Razorpay
- Configure settlement schedule
- Enable auto-refunds

---

## Troubleshooting

### Payment Modal Not Opening
**Issue:** Razorpay checkout doesn't open

**Solutions:**
1. Check if Razorpay script is loaded:
   ```html
   <!-- In client/index.html -->
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```
2. Check browser console for errors
3. Verify `RAZORPAY_KEY_ID` is correct

### Payment Verification Failed
**Issue:** Signature verification fails

**Solutions:**
1. Verify `RAZORPAY_KEY_SECRET` matches dashboard
2. Check signature generation logic
3. Ensure payment ID and order ID match

### Webhook Not Working
**Issue:** Webhooks not received

**Solutions:**
1. Check webhook URL is accessible
2. Verify webhook secret matches
3. Check Razorpay webhook logs
4. For local dev, ensure ngrok is running

### Amount Mismatch
**Issue:** Payment amount doesn't match order

**Solutions:**
1. Check amount is in paise (multiply by 100)
2. Verify decimal precision
3. Check currency conversion

---

## Testing Scenarios

### Test Cards (Test Mode Only)

| Card Number         | CVV | Expiry    | Result  |
|---------------------|-----|-----------|---------|
| 4111 1111 1111 1111 | Any | Any future| Success |
| 4012 0010 3714 1112 | Any | Any future| Success |
| 5555 5555 5555 4444 | Any | Any future| Success |

### Test UPI IDs

| UPI ID              | Result  |
|---------------------|---------|
| success@razorpay    | Success |
| failure@razorpay    | Failure |

### Test Wallets
- Select any wallet
- Click "Pay"
- Success/failure determined by test credentials

---

## File Structure

```
HaritsattvaFresh/
├── server/
│   ├── razorpayService.ts         # Razorpay API integration
│   └── routes.ts                  # Payment API endpoints
├── client/src/
│   ├── hooks/
│   │   └── useRazorpay.ts         # React hook for payments
│   └── pages/
│       └── CheckoutPage.tsx       # Checkout with payment
├── shared/
│   └── schema.ts                  # Payment schema
└── .env                           # Razorpay credentials
```

---

## Support & Resources

### Official Documentation
- **Razorpay Docs:** https://razorpay.com/docs/
- **Payment Gateway:** https://razorpay.com/docs/payments/
- **Webhooks:** https://razorpay.com/docs/webhooks/

### Dashboard Links
- **Dashboard:** https://dashboard.razorpay.com
- **API Keys:** https://dashboard.razorpay.com/app/keys
- **Webhooks:** https://dashboard.razorpay.com/app/webhooks
- **Test Cards:** https://razorpay.com/docs/payments/payments/test-card-details/

### Support
- **Razorpay Support:** support@razorpay.com
- **Developer Community:** https://community.razorpay.com

---

## License & Compliance

### PCI DSS Compliance
Razorpay is PCI DSS Level 1 certified. You don't need separate PCI compliance when using Razorpay Checkout as card details never touch your servers.

### Data Privacy
- Payment data is stored on Razorpay servers
- Only order ID and payment status stored locally
- GDPR compliant

### Terms of Service
Review Razorpay's terms: https://razorpay.com/terms/

---

## Changelog

### Version 1.0 (Current)
- UPI payment support
- Payment verification
- Webhook integration
- COD fallback
- Order tracking

### Future Enhancements
- Card payments
- Net banking
- Wallets (Paytm, PhonePe Pay)
- EMI options
- Subscription payments
- Refund management UI

---

**Last Updated:** 2025-01-27
**Razorpay SDK Version:** 2.9.6
**Node.js Version:** 20+
