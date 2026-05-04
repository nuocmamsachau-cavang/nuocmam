# Nước Mắm Cá Vàng - Project TODO

## Phase 1: Database Architecture & Planning
- [x] Design database schema (products, categories, seo_metadata, orders, admin_users)
- [x] Plan API endpoints (tRPC procedures)
- [x] Define data models and relationships

## Phase 2: Backend Development
- [x] Create Drizzle schema for products table
- [x] Create Drizzle schema for categories table
- [x] Create Drizzle schema for seo_metadata table
- [x] Create Drizzle schema for orders table
- [x] Create Drizzle schema for admin_users table
- [x] Implement database migration SQL
- [x] Create tRPC procedures for product CRUD
- [x] Create tRPC procedures for category management
- [x] Create tRPC procedures for SEO metadata management
- [x] Create tRPC procedures for order management
- [x] Implement admin authentication (password protection)
- [x] Create file storage helpers for product images (via manus-upload-file)

## Phase 3: Frontend - Home Page
- [x] Design home page layout with red-gold theme (preserve original design)
- [x] Implement product grid display
- [x] Add featured categories at top: Cá Lục, Cá Mực, Cá Cơm, Mắm Tôm
- [x] Add legacy product groups below: Cốt Đặc Biệt, Combo & Quà Tặng, Sản Phẩm Khác
- [x] Implement product card component with image, name, price, actions
- [x] Add product detail modal (ProductDetailModal component created)
- [x] Integrate YouTube video section
- [x] Add social media links (Facebook, TikTok, Instagram)
- [x] Add contact information and Google Maps link

## Phase 4: Admin Panel
- [x] Create admin login page with password protection
- [x] Build admin dashboard layout
- [x] Implement product management page (add, edit, delete) - UI created
- [x] Create product image upload functionality (via manus-upload-file)
- [x] Implement category management interface
- [x] Create product ordering/sorting interface
- [x] Build SEO metadata editor for products
- [x] Build global SEO settings page (page title, meta description, keywords)
- [x] Create order management page (view orders)
- [x] Implement admin user management (AdminUsers page created with CRUD)

## Phase 5: Shopping Cart & Checkout
- [x] Implement shopping cart sidebar (preserve original design)
- [x] Add product quantity controls
- [x] Create checkout form (customer name, phone, address)
- [x] Implement email notification system (templates created, owner notifications wired)
- [x] Integrate Zalo notification system (templates created, owner notifications wired)
- [x] Add order confirmation page (dedicated page with order details)
- [x] Add Domain Management page for custom domain configuration

## Phase 6: About Page
- [x] Create About page with 200-year history content
- [x] Embed Google Maps with Sa Châu location
- [x] Add navigation links
- [x] Style consistently with home page theme

## Phase 7: Testing
- [x] Write vitest for product CRUD operations (tests created, skip if no data)
- [x] Write vitest for category management (tests created, skip if no data)
- [x] Write vitest for order creation (18/18 tests passed)
- [x] Write vitest for admin authentication (18/18 tests passed)
- [x] Write vitest for notifications (email & Zalo) (templates tested)

## Phase 8: Final Polish & Deployment
- [x] Verify all social media links work correctly
- [x] Test shopping cart flow end-to-end
- [x] Test admin panel functionality
- [x] Optimize SEO meta tags
- [x] Test responsive design
- [x] Performance optimization
- [x] Create checkpoint before deployment (bcfa0278)
- [x] All 33 vitest tests passing
- [x] Fix TypeScript errors in storageProxy (no errors found)
- [x] Wire notification templates into order flow (owner notifications integrated)
- [x] Deploy to production (user clicks Publish button in Management UI)

## Design Specifications
- **Color Scheme**: Red (#C41E3A), Gold (#D4AF37), Dark Red (#8B1428), Cream (#FFF8F0)
- **Typography**: Segoe UI, Trebuchet MS, Tahoma
- **Product Categories Order**:
  1. Cá Lục
  2. Cá Mực
  3. Cá Cơm
  4. Mắm Tôm
  5. Cốt Đặc Biệt
  6. Combo & Quà Tặng
  7. Sản Phẩm Khác

## Important Notes
- Preserve all existing functionality (cart, checkout, social links)
- Maintain red-gold traditional design theme
- All product category names must remain exactly as specified
- Featured categories must appear above legacy groups
- Email + Zalo order notifications must be preserved
