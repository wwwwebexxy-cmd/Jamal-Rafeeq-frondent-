# Jamal Rafeeq storefront

The public app is catalogue-only: homepage, product discovery, product detail,
about, contact, and WhatsApp enquiries. Customer accounts, cart, checkout,
wishlist, profile, and order-history UI are intentionally not part of the
storefront.

For a production build, configure `VITE_API_BASE_URL` and
`VITE_WHATSAPP_NUMBER`, then run:

```powershell
npm ci
npm run build
```

Deploy the generated `dist/` directory to the AWS static-hosting layer (for
example S3 + CloudFront) and configure the backend API origin/proxy separately.
