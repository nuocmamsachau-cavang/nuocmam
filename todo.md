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
- [ ] Create file storage helpers for product images

## Phase 3: Frontend - Home Page
- [x] Design home page layout with red-gold theme (preserve original design)
- [x] Implement product grid display
- [x] Add featured categories at top: Cá Lục, Cá Mực, Cá Cơm, Mắm Tôm
- [x] Add legacy product groups below: Cốt Đặc Biệt, Combo & Quà Tặng, Sản Phẩm Khác
- [x] Implement product card component with image, name, price, actions
- [ ] Add product detail modal
- [x] Integrate YouTube video section
- [x] Add social media links (Facebook, TikTok, Instagram)
- [x] Add contact information and Google Maps link

## Phase 4: Admin Panel
- [x] Create admin login page with password protection
- [x] Build admin dashboard layout
- [ ] Implement product management page (add, edit, delete) - UI created, need backend integration
- [ ] Create product image upload functionality
- [x] Implement category management interface
- [ ] Create product ordering/sorting interface
- [x] Build SEO metadata editor for products
- [x] Build global SEO settings page (page title, meta description, keywords)
- [ ] Create order management page
- [ ] Implement admin user management

## Phase 5: Shopping Cart & Checkout
- [x] Implement shopping cart sidebar (preserve original design)
- [x] Add product quantity controls
- [x] Create checkout form (customer name, phone, address)
- [ ] Implement email notification system
- [ ] Integrate Zalo notification system
- [ ] Add order confirmation page

## Phase 6: About Page
- [x] Create About page with 200-year history content
- [x] Embed Google Maps with Sa Châu location
- [x] Add navigation links
- [x] Style consistently with home page theme

## Phase 7: Testing
- [ ] Write vitest for product CRUD operations
- [ ] Write vitest for category management
- [ ] Write vitest for order creation
- [x] Write vitest for admin authentication
- [ ] Write vitest for SEO metadata management

## Phase 8: Final Polish & Deployment
- [ ] Verify all social media links work correctly
- [ ] Test shopping cart flow end-to-end
- [ ] Test admin panel functionality
- [ ] Optimize SEO meta tags
- [ ] Test responsive design
- [ ] Performance optimization
- [ ] Create checkpoint before deployment
- [ ] Deploy to production

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
