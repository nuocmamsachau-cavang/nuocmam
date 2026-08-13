# Vercel deployment notes

- Vercel project URL: https://vercel.com/nuocmamcavang/nuocmam-product-feed
- Public deployment URL: https://nuocmam-product-feed.vercel.app
- First deployment ID: dpl_9S2ME3PCgjsnHM1brqRmuou71bWj
- Vercel project is connected to GitHub repository: https://github.com/nuocmamcavangsachau-ship-it/nuocmam-product-feed
- The import flow cloned source repository https://github.com/nuocmamsachau-cavang/nuocmam from branch product-feed-live.
- Deployment completed with Vercel success page and preview screenshot showing the Nước Mắm Cá Vàng site.
- Initial visit to https://nuocmam-product-feed.vercel.app/operations showed the dashboard login screen. The provided GOSA credentials were rejected because the Vercel project currently has no environment variables and therefore no local database connection.
- Vercel Environment Variables page: https://vercel.com/nuocmamcavang/nuocmam-product-feed/settings/environment-variables. It reports: No Environment Variables Added.
- Vercel Git settings page: https://vercel.com/nuocmamcavang/nuocmam-product-feed/settings/git. It confirms the connected Git repository above and the default deployment branch is main in the cloned repository.
- Existing Manus data endpoints tested successfully without credentials: https://nuocmampro-fdjnndux.manus.space/api/trpc/products.list?input=%7B%22json%3A%7B%22sort%22%3A%22salesDesc%22%7D%7D, https://nuocmampro-fdjnndux.manus.space/api/trpc/orders.list?input=%7B%22json%3A%7B%7D%7D, https://nuocmampro-fdjnndux.manus.space/api/trpc/analytics.getDashboard?input=%7B%22json%3A%7B%7D%7D, and https://nuocmampro-fdjnndux.manus.space/api/trpc/analytics.getAds?input=%7B%22json%3A%7B%7D%7D.
- The source project now contains server/legacyData.ts and fallback calls in server/routers.ts so Vercel can use the Manus deployment as a read-only data source when DATABASE_URL is absent. Local verification: pnpm check passed, 90/90 Vitest passed, pnpm build passed.

## V2 deployment

- A second Vercel project creation was started from the updated branch product-feed-live using repository name nuocmam-product-feed-v2 because the first Vercel-created clone is not accessible through the current gh CLI token.
- Vercel confirms it is cloning the updated source into nuocmamcavangsachau-ship-it/nuocmam-product-feed-v2. Deployment is still in the Preparing Git Repository stage at the time of this note.

- V2 deployment ID: dpl_9v1xWEnsjy1kiBMbM9RizxZNAboU. Vercel successfully cloned the updated branch into the v2 repository and reached the TypeScript build phase. The build log currently shows 2 diagnostics while still loading; no final success or failure page has appeared yet.

- V2 deployment completed successfully. Public URL: https://nuocmam-product-feed-v2.vercel.app. Vercel success page preview rendered the public storefront.
- Dashboard URL opened successfully: https://nuocmam-product-feed-v2.vercel.app/operations. It shows the Sa Châu OS login form from the updated build.
- Next verification step is to log in with the already supplied admin credentials and confirm the Product Feed menu and live data fallback.

## V2 runtime diagnosis

- V2 static deployment succeeded, but every `/api/*` request returned HTTP 500 FUNCTION_INVOCATION_FAILED.
- Vercel runtime log identified the exact cause: `ERR_MODULE_NOT_FOUND: Cannot find module '/var/task/server/_core/index' imported from /var/task/api/index.js`.
- The source fix changes `api/index.ts` from extensionless `../server/_core/index` to ESM-compatible `../server/_core/index.js`.
- Local verification after this fix: TypeScript check passed, all 90 Vitest tests passed, and production build passed.
- Commit containing the fix: a438673, pushed to GitHub branch product-feed-live.

## V3 deployment

- V3 deployment ID: dpl_AQ3FdpNAZppdwxHpwcY2CgAou3X7.
- Vercel cloned the source branch product-feed-live into nuocmamcavangsachau-ship-it/nuocmam-product-feed-v3 with commit a1e0b5dd01b64b07f69212bdc1e46bf4cc94d6e3. This clone was created after source commit a438673, which contains the ESM entrypoint fix.
- V3 reached the build stage; final deployment status is still pending at the time of this note.

## V3 runtime diagnosis

- V3 deployed successfully at https://nuocmam-product-feed-v3.vercel.app, but API requests still returned HTTP 500.
- Vercel logs showed the next unresolved ESM import: `ERR_MODULE_NOT_FOUND: Cannot find module '/var/task/server/_core/oauth' imported from /var/task/server/_core/index.js`.
- A controlled normalization script updated 66 extensionless relative imports across 35 files under api/ and server/ to include `.js`.
- Local verification after normalization: TypeScript check passed, 90/90 Vitest tests passed, and production build passed.
- The next deployment must use this normalized import graph.
