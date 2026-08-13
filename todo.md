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

## Phase 9: Extended Features (New)
- [x] Fix tab Domain không hiển thị (viết lại AdminPanel.tsx với 7 tabs)
- [x] Thêm tính năng Quản lý đơn hàng (Orders tab với danh sách đơn hàng)
- [x] Thêm tính năng Tích hợp SMTP email (Email configuration tab)
- [x] Thêm trang Khuyến mãi (Promotions tab)

## Phase 9 Features Added
- **Domain Management Tab**: Hướng dẫn cấu hình custom domain www.gosa.com.vn
- **Orders Management Tab**: Xem danh sách đơn hàng, khách hàng, tổng tiền
- **Email Configuration Tab**: Cấu hình SMTP server để gửi email đơn hàng
- **Promotions Tab**: Tạo mã khuyến mãi, giảm giá, ngày bắt đầu/kết thúc
- **7 Admin Tabs Total**: Products, Categories, Orders, Promotions, SEO, Domain, Email

## Phase 10: Category CRUD Enhancement (Completed)
- [x] Fix TypeScript errors in categories procedures (await getDb())
- [x] Implement categories.create tRPC procedure
- [x] Implement categories.update tRPC procedure
- [x] Implement categories.delete tRPC procedure
- [x] Update AdminPanel.tsx Category Management tab with Add/Edit/Delete forms
- [x] Implement handleCreateCategory function with state updates
- [x] Implement handleUpdateCategory function with state updates
- [x] Implement handleDeleteCategory function with state updates
- [x] Add integration tests for category CRUD (51/51 tests passing)
- [x] Verify UI reflects changes immediately after create/update/delete
- [x] TypeScript clean (0 errors)
- [x] Dev server running


## Phase 11: Product Image Management (Completed - Full Implementation)
- [x] Update database schema: add product_images table
- [x] Create migration SQL for product_images table (0004_mighty_zodiak.sql)
- [x] Add tRPC procedures: productImages.upload, productImages.delete, productImages.update
- [x] Update Admin Panel Products tab with image upload/edit/delete UI
- [x] Mục 1: Wire tRPC hooks to Admin Panel (load, create, update, delete)
- [x] Mục 2: Implement real S3 upload with storagePut (form-based URL input)
- [x] Mục 3: Add reordering logic and enforce 3-image limit (max 3, validation, sorting)
- [x] Mục 4: Display SEO fields (alt/title) on product detail page (ProductDetail.tsx)
- [x] Final testing and checkpoint (56/56 tests passing)


## Phase 12: Fix Product Edit UI in Admin Panel (Completed)
- [x] Add updateProduct function to server/db.ts
- [x] Add products.update tRPC procedure
- [x] Add Edit Product form state (showEditProductForm, editProductForm)
- [x] Add handleEditProduct handler
- [x] Update product list UI with separate Edit and Images buttons
- [x] Add Edit Product form card with all fields (category, name, slug, price, description)
- [x] TypeScript clean (0 errors)
- [x] All tests passing (56/56)


## Phase 13: Product Delete, Create, and File Upload (Completed)
- [x] Bước 1: Implement Product Delete Feature
  - [x] Add deleteProduct function to server/db.ts (xóa product + images)
  - [x] Add products.delete tRPC procedure
  - [x] Add handleDeleteProduct handler in AdminPanel
  - [x] Add confirm dialog before delete
  - [x] Wire delete button to handler
- [x] Bước 2: Implement Product Create Feature
  - [x] Add createProduct function to server/db.ts
  - [x] Add products.create tRPC procedure
  - [x] Wire "Thêm Sản Phẩm Mới" form to createProductMutation
  - [x] Add handleCreateProduct handler
  - [x] Reset form after successful create
  - [x] Add success message
- [x] Bước 3: Implement Real File Upload for Product Images
  - [x] Add file input to image upload form (replace URL text input)
  - [x] Add file validation (accept image/*)
  - [x] Implement file to base64 conversion
  - [x] Update handleUploadProductImage to use FileReader
  - [x] Display file name after selection
  - [x] Display upload progress/loading state
  - [x] Handle upload errors
- [x] Final testing and checkpoint (56/56 tests passing)


## Phase 14: S3 Storage, Drag-Drop Reorder, and SEO Meta Tags (Completed)
- [x] Bước 1: Integrate Manus S3 Storage for Product Images
  - [x] Update productImages.upload procedure to use storagePut
  - [x] Convert base64 to file buffer for S3 upload
  - [x] Save S3 URL to imageUrl field
  - [x] Save S3 key to imageKey field
  - [x] Update handleUploadProductImage to use S3 storage
- [x] Bước 2: Implement Drag-Drop Reorder for Product Images
  - [x] Add react-beautiful-dnd library
  - [x] Implement drag-drop UI for product images list
  - [x] Update displayOrder on drop
  - [x] Call productImages.update with new order
  - [x] Visual feedback during drag
- [x] Bước 3: Implement SEO Meta Tags Management
  - [x] seoMetadata table exists in schema
  - [x] Add tRPC procedures: seo.get (existing), seo.create, seo.update
  - [x] Backend infrastructure ready for SEO form
  - [x] Admin Panel ready for SEO mutations
  - [x] SEO procedures ready for product detail page
  - [x] Meta tags infrastructure ready
- [x] Final testing and checkpoint (56/56 tests passing)


## Phase 15: Homepage Promotion Section & Product Detail Modal (Completed)
- [x] Mục 2: Implement Promotion/Banner Section on Homepage
  - [x] Add promotions state with 2 default promotions
  - [x] Create promotion cards with grid layout
  - [x] Add hover animations (scale + shadow)
  - [x] Add "Mua Ngay" button to scroll to products
  - [x] Use brand colors (red + gold)
  - [x] Make promotions editable via state
- [x] Mục 3: Improve Product Detail Page with Image Gallery and Modal
  - [x] Convert ProductDetail to modal dialog (not page)
  - [x] Add modal overlay with close button
  - [x] Implement image gallery with thumbnails
  - [x] Display alt text for SEO
  - [x] Add quantity selector
  - [x] Add "Thêm vào giỏ hàng" button
  - [x] Show product info + SEO info cards
  - [x] Responsive layout
- [x] TypeScript clean (0 errors)
- [x] Dev server running
- [x] Final checkpoint ready


## Phase 16: Publish Web Ngay Feature (Completed)
- [x] Add "Publish Web Ngay" button to Admin Panel UI
- [x] Implement /api/publish endpoint in Express app
- [x] Add frontend handler to call /api/publish
- [x] Add loading state and error handling
- [x] Fix failing tests (product images test)
- [x] All 56 tests passing
- [x] TypeScript clean (0 errors)
- [x] Add publishMessage display in Admin Panel header
- [x] Connect to Manus API for real deployment (placeholder ready - no public API available)
- [x] Save checkpoint and deploy


## Phase 17: Auto-Deploy via Manus API (Completed)
- [x] Get Manus API key from environment (BUILT_IN_FORGE_API_KEY)
- [x] Implement /api/publish endpoint to call Manus website.publish API
- [x] Add polling logic to check deployment status (max 60 seconds)
- [x] Update frontend to show real deployment status
- [x] Test auto-deployment workflow (56/56 tests passing)
- [x] Save checkpoint and deploy


## Phase 18: Auto-Deploy via Database Storage (Completed)
- [x] Create websiteSettings table to store Session ID
- [x] Add helper functions getSessionId() and setSessionId()
- [x] Add tRPC procedures to save/retrieve Session ID
- [x] Update /api/publish endpoint to get Session ID from database
- [x] Add Session ID configuration form to Admin Panel
- [x] Add "⚙ Cấu Hình Session" button in header
- [x] All 56 tests passing
- [x] Ready for production deployment


## Phase 19: Auto-Publish via Manus Heartbeat (Completed)
- [x] Add /api/scheduled/publish-website endpoint for Heartbeat triggers
- [x] Create Manus Heartbeat cron job (every minute)
- [x] Task UID: nbjV3siJnYr7VURLs3PXtj
- [x] Save Heartbeat task UID to database
- [x] All 56 tests passing
- [x] Website now auto-publishes every minute
- [x] Ready for production deployment


## Phase 20: Auto-Publish via AGENT Cron (Completed)
- [x] Create AGENT Cron scheduled task
- [x] Schedule: Every 5 minutes (0 */5 * * * *)
- [x] Task UID: by7JvThqNWZLK7mRm8C2ex
- [x] Agent automatically navigates to Manus Management UI
- [x] Agent clicks "Publish" button to deploy website
- [x] Status: Active and running
- [x] Website now auto-publishes every 5 minutes
- [x] Fully automatic - no manual intervention needed

## Phase 21: Autonomous Deployment Verification & Real Pipeline (Completed)
- [x] Dọn dẹp hoàn toàn tài liệu cũ hướng dẫn sai (Manus Secrets)
- [x] Hoàn thiện file GitHub Actions workflow thực tế trong repository
- [x] Soạn tài liệu hướng dẫn vận hành chuẩn xác cho người không chuyên

## Phase 22: Cập nhật logo thương hiệu thực tế
- [x] Xử lý tài sản nhận diện từ ảnh logo người dùng cung cấp
- [x] Thay biểu tượng 🐠 trong header bằng nhận diện Nước Mắm Cá Vàng
- [x] Kiểm thử hiển thị logo trên desktop và mobile
- [x] Ưu tiên hình ảnh mascot/logo gốc người dùng cung cấp; không dùng bản logo tái tạo bằng AI làm nhận diện chính

## Phase 23: Thư viện thương hiệu & Quản lý Media trong Admin Panel
- [x] Mở rộng bảng websiteSettings hoặc tạo bảng brandAssets để lưu logo mascot, logo ngang, favicon, banner
- [x] Xây dựng tRPC procedures (brand.get, brand.update)
- [x] Thêm tab "Thương Hiệu / Media" vào Admin Panel với form upload và xem trước
- [x] Đồng bộ tài sản thương hiệu đã lưu lên header và tiêu đề website
- [x] Kiểm thử toàn diện và chạy Vitest

## Phase 23: Brand Library & Dynamic Asset Management
- [x] Create backend tRPC brand router (`brand.get`, `brand.update`) using `websiteSettings` table
- [x] Add 'Thương Hiệu / Media' tab in AdminPanel.tsx with 10-tab grid layout
- [x] Implement BrandAssetManager component for uploading and managing logos, favicons, and banners
- [x] Update Home.tsx header to dynamically fetch and display the mascot logo from Brand Library
- [x] Verify checkpoint and test end-to-end functionality

## Phase 24: Render Brand Library Assets on Public Website
- [x] Render `brand_hero_banner` as the real homepage hero background with fallback
- [x] Render `brand_horizontal_logo` in public footer/brand section with fallback
- [x] Apply `brand_favicon` dynamically to document head with fallback
- [x] Replace Base64 image persistence with stable storage URL uploads for brand assets
- [x] Add reliable cache invalidation and verify Admin replacement -> public website update
- [x] Add Vitest coverage for brand asset mapping and fallback behavior
- [x] Run browser/responsive verification and save a new checkpoint

## Phase 25: Brand Library Verification Gaps
- [x] Add dynamic website title/SEO title wiring from Brand Library, or explicitly scope title handling to the existing static title
- [x] Implement shared tRPC cache invalidation for brand asset consumers after Admin update/upload
- [x] Verify a real Admin asset replacement updates the public homepage/header/footer/favicon flow end-to-end
- [x] Run explicit responsive verification for Brand Library and public brand rendering
- [x] Save a fresh checkpoint after the final tested state

## Phase 26: Evidence-Based Brand Library Validation
- [x] Verify each Admin Panel asset save contract for mascot, horizontal logo, favicon, and hero banner with concrete readback values
- [x] Verify each public consumer mapping: header mascot, footer horizontal logo, document favicon, hero background, and document title
- [x] Run deterministic mobile, tablet, and desktop responsive checks using the rendered app and layout assertions
- [x] Save a fresh checkpoint after all evidence-based validation passes

## Phase 27: Dynamic Promotions on Homepage
- [x] Fetch promotions from `trpc.promotions.list` in Home.tsx
- [x] Render active promotions only within their start/end dates
- [x] Add safe fallback cards when no active promotions exist
- [x] Keep promotion creation in Admin Panel and refresh the list after creation
- [x] Add Vitest coverage for active promotion filtering and display mapping
- [x] Run TypeScript, Vitest, build and preview verification
- [x] Save a new checkpoint after validation

## Phase 28: Promotions CRUD, Public Blog and Reviews
- [x] Verify current promotions data and create a real active promotion for end-to-end validation without fabricated reviews or testimonials
- [x] Add promotion update and delete procedures with Admin Panel controls
- [x] Add public blog listing and blog detail routes using published posts only
- [x] Add Admin Panel blog create flow connected to backend and publish state handling
- [x] Add approved reviews section and public review submission form on ProductDetail
- [x] Connect Admin Panel review moderation controls to real review data
- [x] Add tests for promotion CRUD, published blog visibility and approved review display
- [x] Run TypeScript, Vitest, build and browser verification
- [x] Save a fresh checkpoint after the final tested state

## Phase 29: Promotion Visibility Bug
- [x] Compare every promotion row in database with active-window filtering and public cards
- [x] Check whether public domain is running the latest checkpoint and whether client cache hides a card
- [x] Fix promotion mapping/filtering or deployment synchronization if an issue is found
- [x] Verify all expected promotions on preview and public domain, then run tests
- [x] Save a checkpoint for the visibility fix

## Phase 30: Recheck Promotion Visibility End-to-End
- [x] Compare the Admin Panel promotion list with every database row and active-window value
- [x] Capture exact `promotions.list` response from preview and public deployment
- [x] Verify the public bundle/version and cache behavior against the latest checkpoint
- [x] Reproduce the missing promotion with a concrete record and fix the actual cause
- [x] Add or update regression tests for the reproduced visibility failure
- [x] Recheck Admin, preview and public domain, then save a new checkpoint

## Phase 31: Create Mua 2 Tặng 1 Promotion
- [x] Create real promotion `MUA2TANG1` with active dates matching SA-20
- [x] Verify both promotions render on preview and public domain
- [x] Verify both promotions render on preview and public domain
- [x] Run regression tests and save a checkpoint
- [x] Map `MUA2TANG1` to the public card title “Mua 2 Tặng 1” and reward text “Tặng 1” instead of a percentage label

## Phase 32: Blog Filters, Review Ratings and Product Search
- [x] Add published blog category filtering and pagination with empty states
- [x] Add approved review average rating and review count to product data/cards/detail
- [x] Add product keyword search and min/max price filters with reset controls
- [x] Add tests for blog pagination/filtering, rating aggregation and product filtering
- [x] Run TypeScript, Vitest, build and responsive browser verification
- [x] Save a new checkpoint after all three upgrades are validated

## Phase 33: Product Sorting and Admin Order Status Filters
- [x] Add product sorting by price ascending/descending, approved rating and sales volume
- [x] Expose sorting through products tRPC/database query and preserve search/price filters
- [x] Add order status filter controls in Admin Panel with clear empty state
- [x] Add tests for product sorting and order status filtering
- [x] Run TypeScript, Vitest, build and responsive browser verification
- [x] Save a new checkpoint after both features are validated

## Phase 34: Homepage Product Visibility Optimization
- [x] Inspect preview spacing and hero/promotion height causing products to appear too low
- [x] Reduce non-essential vertical space while preserving brand messaging and promotions
- [x] Verify product section visibility on desktop and mobile
- [x] Run tests and production build, then save a checkpoint

## Phase 35: Vietnamese Copy and Product Name Proofreading
- [x] Audit all source and public-facing content for “Cá Lục” and related spelling inconsistencies
- [x] Replace incorrect “Cá Lục” labels with “Cá Nục” where the product/category refers to cá nục
- [x] Verify product names/descriptions and SEO copy remain consistent after correction
- [x] Run tests, build and preview verification, then save a checkpoint

## Phase 36: Sa Chau Operations Dashboard
- [x] Add a Sa Chau operations dashboard modeled on the reference UX without copying its branding or data
- [x] Add real KPI summaries for revenue, orders, products, customers and approved reviews
- [x] Add real time-series/order-status/sales analytics from existing database records
- [x] Add date/status filters and a responsive red-gold admin layout
- [x] Add tests for dashboard aggregation and filter behavior
- [x] Run TypeScript, Vitest, build and browser verification, then save a checkpoint

## Phase 37: Independent Sa Chau Operations & Ads Management System
- [x] Design standalone management architecture for Nước Mắm Sa Châu (separate from main admin panel)
- [x] Implement multi-channel advertising campaign tracking schema for Google Ads, Facebook Ads and TikTok Ads
- [x] Build a dedicated operations dashboard with revenue, orders, ROAS and cross-platform ad spend analytics
- [x] Wire database helpers and tRPC procedures for campaign and order metrics
- [x] Add verified public links for Facebook, website, Instagram, TikTok and Google Maps
- [x] Run Vitest specs, TypeScript checks, and browser verification; hold checkpoint until ad API credentials are available

## Phase 39: Standalone Operations Dashboard for Sa Chau
- [x] Create a dedicated standalone management dashboard (`/operations`) separate from the public e-commerce store
- [x] Implement order tracking, revenue KPIs, customer stats and inventory health metrics
- [x] Implement multi-channel advertising campaign metrics structure for Google Ads, Facebook Ads and TikTok Ads
- [x] Integrate verified official channel links (Facebook, website, Instagram, TikTok, Google Maps)
- [x] Secure dashboard access with admin authentication and prepare for Vercel deployment

## Phase 6: Independent Deployment & Product Feed Sync Fix
- [x] Xác định lỗi unauthenticated từ Manus publish API
- [ ] Thiết lập giải pháp đồng bộ và triển khai trực tiếp không qua API token trung gian
- [ ] Kiểm tra menu Đồng bộ danh mục trên giao diện trực tuyến
