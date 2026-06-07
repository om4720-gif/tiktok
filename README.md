# Shopify Theme for Luxe Covers

This folder contains a Shopify theme based on your current React/Vite website structure.

## What is included

- `layout/theme.liquid` - main theme layout
- `sections/header.liquid` - site header and navigation
- `sections/footer.liquid` - footer with links
- `sections/hero.liquid` - homepage hero section
- `sections/featured-collections.liquid` - collection preview section
- `sections/customizer.liquid` - interactive product customizer with device, color, engraving, quantity, and cart properties
- `templates/index.liquid` - homepage template
- `templates/list-collections.liquid` - `/collections` landing page
- `templates/collection.liquid` - collection page with sorting and product cards
- `templates/cart.liquid` - cart page with editable quantities, customization details, trust badges, and Shopify checkout button
- `templates/product.liquid` - product page with engraving line item properties
- `templates/page.customizer.liquid` - customizer page template
- `assets/base.css` - base styling
- `config/settings_schema.json` - theme editor settings

## Next steps

1. Install Shopify CLI if not already installed.
2. Create a GitHub repository and push this `shopify-theme` folder.
3. Connect the repository to your Shopify store via Shopify Admin or use `shopify theme push`.
4. In Shopify admin, create:
   - a `frontpage` collection for homepage featured products
   - a custom product with handle `custom-luxury-cover`
   - collections with handles `macbook-collection` and `ipad-collection`
   - optional pages for `Contact`, `Shipping`, and `Returns`
5. Use Shopify shipping rates and checkout settings for final checkout costs. Shopify checkout is not theme-editable unless the store has Shopify Plus.

## Recommended Shopify stack

- Shopify Online Store 2.0 theme system
- Liquid for templates and sections
- Line item properties for engraving and customization details
- Shopify shipping/payment settings for checkout
- GitHub integration for theme version control
- Shopify CLI for local development and deployment

## Deploy

Use the Shopify CLI:

```bash
cd shopify-theme
shopify theme serve
```

Or push to a connected GitHub repo and publish from Shopify admin.
