# Project Design System and Figma-to-Code Rules

These rules apply to this React/Vite automotive storefront and should be followed for Figma-driven UI work.

## Project Structure

- Shared application components live in `src/components/`.
- Feature pages, queries, API modules, and feature styles live together under `src/features/<feature>/`.
- Shared utilities live in `src/utils/`; API client and response/configuration helpers live in `src/lib/`.
- Use existing feature components before creating a parallel implementation. Prefer extending the active storefront components used by `src/app/Router.jsx`.
- Use PascalCase for React component files and named feature directories. Keep existing filenames with spaces only when modifying an established feature that already uses them.

## Styling and Design Tokens

- Use the existing CSS architecture: feature-level `.css` files imported by their React components. Do not introduce Tailwind, CSS-in-JS, or a new styling framework.
- Global brand tokens are defined in `src/index.css` as CSS custom properties such as `--brand-red`, `--brand-black`, `--primary-orange` (legacy alias for the red accent), `--primary-slate` (legacy alias for neutral text), `--background`, `--surface-card`, `--border-color`, and the shadow tokens.
- IMPORTANT: Reuse the global tokens and existing component styles before adding new colors, radii, shadows, or typography values. If a new token is genuinely needed, add it to `src/index.css` and use the variable throughout the component.
- Preserve the established visual identity: Jamal Rafeeq red (`--brand-red`) and black (`--brand-black`) with neutral off-white surfaces, Inter for UI text, and Playfair Display for editorial headings. The supplied transparent logo is the source of truth for the red/black palette.
- Keep responsive layouts fluid and test at mobile, tablet, laptop, desktop, and wide desktop widths. Avoid fixed widths that can cause horizontal overflow.
- Use visible focus states and maintain readable contrast for every interactive control.

## Component and Data Patterns

- Use React function components and the existing React Router routes in `src/app/Router.jsx`.
- Use TanStack Query hooks in feature `queries/` files for server state. Keep request details in feature `api/` modules or the shared `src/lib/ApiClient.jsx`; do not add fetch/axios calls directly to presentational components.
- Use `src/lib/ApiClient.jsx` and `src/lib/apiUrl.js` for API access. The API base URL is configured with `VITE_API_BASE_URL`; never hardcode a deployment IP, secret, token, or environment-specific origin.
- Keep product-card, product-detail, filter, loading, empty, and error states visually consistent with their existing components.
- Public product discovery is the `Find Products` route. The customer-facing discovery UI must not reintroduce category or subcategory navigation, wishlist controls, cart controls, or checkout CTAs.
- Product enquiries use `getProductWhatsappUrl` from `src/config/business.js`, with `VITE_WHATSAPP_NUMBER` configured outside source code. WhatsApp messages should include the product name and canonical product link.
- Use `src/assets/jamal-rafeeq-logo-transparent.png` for navbar, footer, and admin-brand placements. Keep the supplied Jamal Rafeeq logo contained without stretching, cropping, recoloring, or changing its aspect ratio; do not reintroduce the white source background in UI chrome.
- The admin workspace is branded as `Jamal Rafeeq` / `Auto Parts Trading LLC`. Keep the existing admin actions for orders, products, brands, customers, marketing, security, CSV export, refresh, and sign-out discoverable; customer-facing category, subcategory, wishlist, and cart controls remain out of the storefront navigation.

## Figma MCP Integration Rules

These rules define how to translate Figma inputs into this codebase.

### Required Flow

1. Run `get_design_context` for the exact Figma node(s) before implementation.
2. If context is too large or truncated, use `get_metadata` to locate the required nodes, then fetch only those nodes.
3. Run `get_screenshot` for the relevant node or variant.
4. Only after context and screenshot are available, retrieve required assets and begin implementation.
5. Translate Figma output into the existing React component and CSS conventions; do not copy Tailwind utilities into the project.
6. Reuse existing components, tokens, routes, query hooks, and API helpers wherever they fit.
7. Validate the rendered result against the Figma reference at representative responsive widths before completing the change.

### Asset Handling

- Use Figma-provided localhost asset sources directly when available.
- Store intentional static assets under `src/assets/` and import them from components; do not create placeholders when a supplied asset exists.
- Do not add a new icon package for a Figma implementation. Reuse the existing `react-icons` dependency or supplied project assets.
- Keep image `alt` text meaningful and mark decorative imagery appropriately.

## Accessibility, Performance, and Testing

- Every button, link, input, select, dialog, and menu must have an accessible name and keyboard behavior.
- Preserve loading, empty, error, and retry states for API-backed screens. Do not replace real API data with hardcoded mock records.
- Lazy-load or defer below-the-fold media where practical, while preserving the requested autoplay/muted behavior for the homepage showcase video.
- Run focused ESLint on changed JSX/JS files, `npm run build`, and relevant Vitest tests after UI changes. Report warnings and unrelated baseline failures accurately.
- Before finishing a Figma-driven change, check for console errors, failed API requests, broken routes, visual overflow, and mobile layout regressions.

## Scope and Safety

- Make the smallest change that satisfies the requested design. Do not redesign unrelated screens or delete backend/admin resources merely because their customer-facing UI is no longer exposed.
- Preserve working authentication, administrative APIs, and existing data contracts unless the task explicitly changes them.
- Never commit credentials, private API keys, OAuth secrets, database passwords, or authentication tokens.
