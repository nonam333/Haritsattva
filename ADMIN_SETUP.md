# Admin Interface Setup Guide

## Overview

A comprehensive admin interface has been added to HaritsattvaFresh with the following features:

- **Role-based access control** (Admin vs Regular Users)
- **Product Management** (Full CRUD operations with image upload)
- **Order Management** (View, update status, track orders)
- **Category Management** (Create and manage product categories)
- **User Management** (View all registered users)
- **Contact Form Submissions** (View customer inquiries)
- **Analytics Dashboard** (Sales metrics, top products, low stock alerts)
- **Customer Checkout Flow** (Multi-step checkout, order history)

---

## Admin Access Configuration

### Setting Up Admin Users

Admin access is controlled via an **email whitelist** in `server/adminAuth.ts`:

```typescript
export const ADMIN_EMAILS = [
  "admin@haritsattva.com",
  "harshraisjc@gmail.com",
];
```

**To make yourself an admin:**
1. Open `server/adminAuth.ts`
2. Add your email address to the `ADMIN_EMAILS` array
3. Save the file and restart the server
4. Log in with that email address - you'll automatically have admin access

---

## Database Schema Changes

### New Tables Added

1. **orders** - Stores customer orders
   - userId, total, status, shipping information
   - Timestamps for created/updated

2. **orderItems** - Line items for each order
   - productId, productName, quantity, price (at time of order)

3. **categories** - Product categories
   - name, description

4. **Updated users table** - Added `role` field ('user' | 'admin')

5. **Updated products table** - Added timestamps and categoryId reference

---

## Admin Routes

### Frontend Routes

- `/admin` - Dashboard with analytics
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/categories` - Category management
- `/admin/contacts` - Contact form submissions
- `/admin/users` - User list

### API Endpoints

#### Admin-Only Endpoints (Require admin authentication)

**Products:**
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/products/upload` - Upload product image

**Categories:**
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

**Orders:**
- `GET /api/admin/orders` - Get all orders with details
- `PUT /api/admin/orders/:id/status` - Update order status

**Users:**
- `GET /api/admin/users` - Get all users

**Analytics:**
- `GET /api/admin/analytics` - Get dashboard statistics

**Admin Check:**
- `GET /api/admin/check` - Check if current user is admin

#### Public/Customer Endpoints

**Products:**
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product

**Categories:**
- `GET /api/categories` - List all categories

**Orders:**
- `POST /api/orders` - Create order (authenticated)
- `GET /api/orders/my-orders` - Get user's orders (authenticated)

**Contact:**
- `POST /api/contact` - Submit contact form
- `GET /api/contact/submissions` - View submissions (authenticated)

---

## Features by Section

### 1. Admin Dashboard
- **Revenue metrics** - Total revenue, order count
- **Product & User stats** - Total products, users, categories
- **Top selling products** - Bar chart with revenue data
- **Low stock alerts** - Products with less than 10 units
- **Order status overview** - Breakdown by status (pending, confirmed, shipped, delivered, cancelled)

### 2. Product Management
- **Create products** - Form with name, description, price, stock, category, image
- **Edit products** - Update any field including images
- **Delete products** - Remove products from catalog
- **Image upload** - Direct image upload with preview
- **Stock tracking** - Visual indicators for low stock items
- **Category assignment** - Link products to categories

### 3. Order Management
- **View all orders** - Complete order list with customer details
- **Order details** - Items, quantities, shipping address, total
- **Status updates** - Change order status (pending → confirmed → shipped → delivered)
- **Customer information** - Name, email, phone, address
- **Order timeline** - Created date and last updated

### 4. Category Management
- **Create categories** - Add new product categories
- **Edit categories** - Update name and description
- **Delete categories** - Remove unused categories
- **Default categories** - Fruits, Vegetables, Herbs (pre-seeded)

### 5. Contact Submissions
- **View inquiries** - All customer contact form submissions
- **Contact details** - Name, email, phone, message, date

### 6. User Management
- **User list** - All registered users with profile info
- **Role display** - Admin vs User badges
- **Registration date** - When user joined
- **Profile pictures** - Avatar display

### 7. Customer Features
- **Checkout flow** - Multi-step form (shipping info, payment method)
- **Order history** - View past orders with status tracking
- **Order details** - Full order breakdown with items and totals

---

## Image Upload Configuration

Product images are uploaded to:
```
attached_assets/uploaded_images/
```

Images are accessible via:
```
/attached_assets/uploaded_images/{filename}
```

**File restrictions:**
- Image files only (checked via mimetype)
- 5MB maximum file size
- Unique filenames (timestamp prefix)

---

## Admin Navigation

The admin panel is accessible via:
1. **Shield icon** in the navbar (visible only to admin users)
2. **Sidebar navigation** within admin panel with sections:
   - Dashboard
   - Products
   - Orders
   - Categories
   - Contact Submissions
   - Users

---

## Order Status Flow

Orders progress through these statuses:
1. **pending** - Order placed, awaiting confirmation
2. **confirmed** - Order confirmed by admin
3. **shipped** - Order shipped to customer
4. **delivered** - Order delivered successfully
5. **cancelled** - Order cancelled

Admins can update status from the Order Management page.

---

## Analytics Calculations

**Total Revenue:** Sum of all order totals

**Top Products:** Based on total revenue per product (top 5 displayed)

**Low Stock:** Products with quantity < 10

**Recent Orders:** Orders from last 7 days

**Order Status Breakdown:** Count of orders grouped by status

---

## Security & Access Control

### Admin Middleware
- Checks if user is authenticated (via Replit Auth)
- Validates email against `ADMIN_EMAILS` whitelist
- Returns 401 if not authenticated, 403 if not admin

### Role Assignment
- Automatically assigned during user creation/login
- Based on email whitelist check
- Stored in user record in database

### Protected Routes
- All `/admin/*` routes require admin access
- All `/api/admin/*` endpoints require admin access
- Frontend checks admin status via `useIsAdmin()` hook
- Backend validates on every admin API request

---

## Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add yourself as admin:**
   - Edit `server/adminAuth.ts`
   - Add your email to `ADMIN_EMAILS` array

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access admin panel:**
   - Log in with your admin email
   - Click the shield icon in the navbar
   - Or navigate to `/admin`

---

## Testing the Admin Interface

### As Admin:
1. Log in with admin email
2. Navigate to `/admin`
3. Create some categories (Vegetables, Fruits, etc.)
4. Add products with images
5. Check analytics dashboard
6. Update order statuses

### As Customer:
1. Log in with non-admin email
2. Browse products
3. Add to cart
4. Checkout
5. View order history at `/orders`

---

## File Structure

```
server/
  ├── adminAuth.ts              # Admin middleware & email whitelist
  ├── routes.ts                 # All API routes (admin & public)
  ├── storage.ts                # In-memory storage with CRUD methods
  └── replitAuth.ts             # Authentication (updated with role assignment)

client/src/
  ├── components/
  │   ├── AdminLayout.tsx       # Admin panel layout with sidebar
  │   └── Navbar.tsx            # Updated with admin link
  ├── pages/
  │   ├── admin/
  │   │   ├── AdminDashboard.tsx
  │   │   ├── ProductManagement.tsx
  │   │   ├── OrderManagement.tsx
  │   │   ├── CategoryManagement.tsx
  │   │   ├── ContactSubmissions.tsx
  │   │   └── UserManagement.tsx
  │   ├── CheckoutPage.tsx      # Customer checkout
  │   ├── OrderHistoryPage.tsx  # Customer order history
  │   └── ProductsPage.tsx      # Updated to fetch from API
  └── hooks/
      └── useIsAdmin.ts         # Admin status check hook

shared/
  └── schema.ts                 # Database schema (updated with new tables)
```

---

## Next Steps / Future Enhancements

- [ ] Add pagination to product/order lists
- [ ] Email notifications for order status changes
- [ ] Bulk product import/export
- [ ] Advanced analytics (date range filters, charts)
- [ ] Payment gateway integration
- [ ] Inventory history tracking
- [ ] Customer reviews and ratings
- [ ] Discount codes and promotions
- [ ] Multi-image support for products
- [ ] Product variants (size, color, etc.)

---

## Troubleshooting

**Can't access admin panel:**
- Verify your email is in `ADMIN_EMAILS` array
- Restart the server after adding your email
- Clear browser cache and log in again

**Images not uploading:**
- Check `attached_assets/uploaded_images` directory exists
- Verify file size is under 5MB
- Ensure file is an image format (jpg, png, etc.)

**Orders not showing:**
- Customers must be logged in to place orders
- Check that products exist in the database
- Verify cart has items before checkout

---

## Support

For issues or questions about the admin interface, please check:
1. This documentation
2. The code comments in the admin-related files
3. The browser console for any JavaScript errors
4. The server logs for API errors
