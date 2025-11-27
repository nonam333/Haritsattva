# Razorpay Quick Start Guide

Get started with Razorpay UPI payments in 5 minutes!

---

## Step 1: Get Your API Keys

1. Go to https://razorpay.com and sign up
2. Login to https://dashboard.razorpay.com
3. Switch to **Test Mode** (top-left toggle)
4. Go to **Settings** → **API Keys**
5. Click **Generate Test Keys**
6. Copy your keys:
   - Key ID: `rzp_test_XXXXXXXXXXXXXX`
   - Key Secret: `rzp_test_XXXXXXXXXXXXXX`

---

## Step 2: Configure Environment Variables

Open `.env` file and replace the placeholders:

```env
# Replace these with your actual Razorpay keys
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
RAZORPAY_WEBHOOK_SECRET=your_random_secret_here
```

**Generate Webhook Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 3: Start the Server

```bash
npm run dev
```

Server will start at http://localhost:5000

---

## Step 4: Test Payment Flow

### Place a Test Order

1. Open http://localhost:5000
2. Login/Signup
3. Add products to cart
4. Go to checkout
5. Fill shipping details
6. Select **UPI** payment method
7. Click **Place Order**

### Complete Payment

When Razorpay modal opens, use test credentials:

**For Success:**
- UPI ID: `success@razorpay`
- Click "Pay Now"

**For Failure:**
- UPI ID: `failure@razorpay`
- Click "Pay Now"

### Verify Result

**Success:**
- Order status → "confirmed"
- Payment status → "paid"
- Success toast appears

**Failure:**
- Payment cancelled
- Order created but payment pending
- Error toast appears

---

## Step 5: Check Payment Records

### Database
Check the `payments` table:
```sql
SELECT * FROM payments ORDER BY created_at DESC LIMIT 5;
```

### Admin Panel
1. Go to http://localhost:5000/admin
2. Click "Orders"
3. Check order payment status

---

## Payment Methods Available

### Current (Phase 1)
- ✅ UPI (GPay, PhonePe, Paytm, etc.)
- ✅ Cash on Delivery (COD)

### Future (Phase 2)
- ⏳ Credit/Debit Cards
- ⏳ Net Banking
- ⏳ Wallets

---

## Troubleshooting

### Payment modal doesn't open
**Check:**
1. Razorpay script loaded in `client/index.html`
2. Browser console for errors
3. API keys are correct

### Payment verification fails
**Check:**
1. `RAZORPAY_KEY_SECRET` matches dashboard
2. Signature verification in browser console
3. Network tab for API errors

### Order not updating
**Check:**
1. Backend logs for errors
2. Database payment record created
3. Order paymentStatus field

---

## Test Cards (if cards enabled)

| Card Number         | Result  |
|---------------------|---------|
| 4111 1111 1111 1111 | Success |
| 4012 0010 3714 1112 | Success |

CVV: Any 3 digits
Expiry: Any future date

---

## Going Live

When ready for production:

1. Complete KYC in Razorpay dashboard
2. Switch to **Live Mode**
3. Generate **Live API Keys**
4. Update `.env` with live keys
5. Test with small real transactions
6. Enable additional payment methods

**See `RAZORPAY_SETUP.md` for detailed production setup.**

---

## Support

- **Razorpay Docs:** https://razorpay.com/docs/
- **Dashboard:** https://dashboard.razorpay.com
- **Support:** support@razorpay.com

---

## Security Reminder

⚠️ **NEVER commit `.env` file to Git!**

✅ Keys are in `.gitignore`
✅ Use test keys for development
✅ Rotate keys regularly
✅ Keep secrets secure

---

**You're all set! Start accepting UPI payments.** 🎉
