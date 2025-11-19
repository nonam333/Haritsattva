# Haritsattva Design Guidelines

## Design Approach
**Reference-Based E-Commerce Design** inspired by premium food marketplaces (Farm to People, Thrive Market, Shopify stores) with emphasis on product photography and minimal chrome. Clean, spacious layouts that let produce imagery take center stage while maintaining sophisticated restraint.

## Core Design Principles
1. **Premium Minimalism**: Generous whitespace, restrained interface elements, hero product photography
2. **Organic Elegance**: Smooth transitions, natural flow, understated animations
3. **Trust & Clarity**: Clean typography, obvious CTAs, transparent information architecture

## Typography System
- **Primary Font**: Inter or DM Sans (Google Fonts) - clean, modern sans-serif
- **Headings**: 
  - H1: 48px/56px desktop, 32px/40px mobile, font-weight 700
  - H2: 36px/44px desktop, 28px/36px mobile, font-weight 600
  - H3: 24px/32px, font-weight 600
- **Body**: 16px/24px, font-weight 400
- **Small Text**: 14px/20px for labels, captions

## Layout & Spacing System
**Tailwind Units**: Standardize on 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- **Section Padding**: py-20 desktop, py-12 mobile
- **Container**: max-w-7xl with px-6 for page content
- **Card Spacing**: p-6 for product cards, gap-6 for grids
- **Component Margins**: mb-8 between major sections, mb-4 for related elements

## Component Library

### Navigation Bar
- Fixed header with backdrop blur effect (backdrop-blur-md)
- Logo left-aligned, navigation links center, cart icon right
- Links: Home, Products, About Us, Policy, Contact
- Minimal height (h-16), subtle border-bottom
- Sticky on scroll with smooth transition

### Hero Section (Homepage)
- Full viewport height (min-h-screen) with premium fruit/vegetable photography
- Large hero image showing vibrant, fresh produce in natural lighting
- Centered content overlay with semi-transparent backdrop
- Headline: "Fresh. Organic. Delivered." (48px/bold)
- Subheadline describing premium quality (18px/regular)
- Primary CTA button with blurred background (backdrop-blur-lg bg-white/20)
- Button text: "Shop Now" with arrow icon

### Product Grid
- 4-column grid desktop (grid-cols-4), 2-column tablet, 1-column mobile
- Product cards with aspect-square images, minimal border (border border-gray-200)
- Hover effect: subtle scale (scale-105) and shadow elevation
- Card content: Product image, name (font-semibold), price, "Add to Cart" button
- Category filters above grid with pill-style buttons

### Product Detail Page
- Split layout: 60% product image gallery, 40% product information
- Large primary image with thumbnail carousel below
- Product info: Name (H1), price (large, bold), description, nutritional info
- Quantity selector with +/- buttons
- Prominent "Add to Cart" CTA (full-width on mobile)
- Related products carousel at bottom

### Cart/Checkout Page
- Clean table layout showing items, quantities, prices
- Left column: cart items with remove option, quantity adjusters
- Right column: order summary card (sticky), subtotal, delivery fee, total
- Progress indicator: Cart → Details → Payment → Confirmation
- Minimal form fields with clear labels and validation states

### Static Pages (Policy, About, Contact)
- Single column layout with max-w-3xl for readability
- Policy: Accordion sections for Privacy, Terms, Returns
- About: Hero image of farmers/produce, mission statement, team values
- Contact: Form left, contact info/map placeholder right (2-column desktop)

### Buttons & Interactive Elements
- Primary: Rounded corners (rounded-lg), medium padding (px-6 py-3)
- Hover states: Subtle brightness increase, smooth transition-all duration-300
- Icons from Heroicons (CDN) - shopping cart, arrow-right, plus/minus, close
- Focus states: Visible outline for accessibility

## Animation Strategy (Minimal & Purposeful)
- **Page Transitions**: Fade-in on load (opacity 0→1, 300ms)
- **Product Cards**: Scale on hover (transform scale-105, 200ms)
- **Cart Updates**: Number badge bounce when item added
- **Scroll Animations**: Fade-up for section reveals (scroll-triggered)
- **Button Interactions**: Subtle scale on click (scale-95)
- **NO**: Excessive parallax, auto-playing carousels, distracting effects

## Images
**Hero Section**: Full-width premium photograph featuring abundant colorful produce - vibrant red tomatoes, green leafy vegetables, purple eggplants arranged artistically with natural lighting and shallow depth of field. Professional food photography aesthetic.

**Product Pages**: High-resolution square images (1:1 aspect ratio) of individual fruits/vegetables on clean white backgrounds. Consistent lighting and styling across all product photography.

**About Page**: Lifestyle image showing farmers at work, organic farms, or hands holding fresh produce to convey authenticity and trust.

## Responsive Behavior
- Desktop: Full multi-column layouts, sidebar navigation
- Tablet (768px): 2-column grids, stacked hero content
- Mobile (640px): Single column, full-width cards, hamburger menu
- Touch targets minimum 44x44px for mobile interactions

## Accessibility Standards
- WCAG AA compliance: contrast ratios, focus indicators
- Keyboard navigation support for all interactive elements
- Alt text for all product images
- Form labels properly associated with inputs
- Semantic HTML structure throughout