# Shopify Theme Starter for Luxe Covers

This folder contains a starter Shopify theme shell based on your current React/Vite website structure.

## What is included
- `layout/theme.liquid` — main theme layout
- `sections/header.liquid` — site header and navigation
- `sections/footer.liquid` — footer with links
- `sections/hero.liquid` — hero section for the homepage
- `sections/featured-collections.liquid` — collection preview section
- `sections/customizer.liquid` — customization landing section
- `templates/index.liquid` — homepage template
- `templates/collection.liquid` — collection template
- `templates/product.liquid` — product page with engraving line item properties
- `templates/page.customizer.liquid` — custom page template
- `assets/base.css` — base styling
- `config/settings_schema.json` — theme editor settings

## Next steps
1. Install Shopify CLI if not already installed.
2. Create a GitHub repository and push this `shopify-theme` folder.
3. Connect the repository to your Shopify store via Shopify Admin or use `shopify theme push`.
4. In Shopify admin, create:
   - a `frontpage` collection for homepage featured products
   - a custom product such as `Custom Luxury Cover` with variants for device and color
   - optional pages for `Contact`, `Shipping`, `Returns`
5. Update asset images in `assets/` and replace `product-hero.jpg` with your design image.

## Recommended Shopify stack
- Shopify Online Store 2.0 theme system
- Liquid for templates and sections
- line item properties for simple engraving/customization
- GitHub integration for theme version control
- Shopify CLI for local development and deployment

## Deploy
Use the Shopify CLI:
```bash
cd shopify-theme
shopify theme serve
```

Or push to a connected GitHub repo and publish from Shopify admin.
