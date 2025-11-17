# Shopify Theme

A modern, feature-rich Shopify theme with advanced functionality and customization options.

## 📋 Overview

This is a custom Shopify theme built with Liquid templating, modern JavaScript, and responsive CSS. It provides a comprehensive e-commerce experience with advanced features for product display, cart management, search, and user interaction.

## 🏗️ Project Structure

```
/workspace/
├── assets/          # Static assets (CSS, JS, fonts, icons)
├── blocks/          # Reusable content blocks (87 Liquid files)
├── config/          # Theme configuration files
├── layout/          # Base layout templates
├── locales/         # Internationalization files (51 languages)
├── sections/        # Theme sections
├── snippets/        # Reusable Liquid snippets (112 files)
└── templates/       # Page templates
```

## ✨ Key Features

### Product Features
- **Product Gallery** - Advanced media gallery with zoom functionality
- **Product Recommendations** - AI-powered product suggestions
- **Recently Viewed Products** - Track and display customer browsing history
- **Quick Add** - Fast add-to-cart without leaving collection pages
- **Variant Picker** - Intuitive product variant selection
- **Product Inventory** - Real-time inventory status display
- **Gift Card Support** - Full gift card functionality with recipient forms

### Cart & Checkout
- **Cart Drawer** - Slide-out cart panel
- **Cart Discounts** - Promotional discount codes
- **Cart Notes** - Customer order notes
- **Local Pickup** - In-store pickup options
- **Dynamic Quantity Selector** - Intuitive quantity controls

### Search & Navigation
- **Predictive Search** - Real-time search suggestions
- **Faceted Search** - Advanced filtering and sorting
- **Header Drawer** - Mobile-friendly navigation
- **Collection Links** - Smart collection navigation

### Content & Display
- **Slideshow** - Hero image carousels
- **Logo Slider** - Partner/brand logo displays
- **Marquee** - Scrolling text announcements
- **Announcement Bar** - Promotional message bar
- **Jumbo Text** - Large-format text displays
- **Video Background** - Video hero sections

### User Experience
- **View Transitions** - Smooth page transitions
- **Anchored Popover** - Contextual popovers
- **Floating Panel** - Sticky UI elements
- **Auto-close Details** - Smart accordion behavior
- **Drag Zoom Wrapper** - Touch-friendly image zoom
- **Copy to Clipboard** - Easy content sharing

### Localization & Accessibility
- **Multi-language Support** - 51 locale files included
- **Localization Component** - Dynamic language/currency switching
- **Focus Management** - Keyboard navigation support
- **Dialog System** - Accessible modal dialogs

## 🚀 Installation

### Prerequisites
- Shopify Partner account or store access
- [Shopify CLI](https://shopify.dev/themes/tools/cli) installed
- Node.js (optional, for local development)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd workspace
   ```

2. **Connect to your Shopify store**
   ```bash
   shopify theme dev
   ```

3. **Push theme to Shopify**
   ```bash
   shopify theme push
   ```

## 🛠️ Development

### Local Development

Run the theme locally with hot-reload:
```bash
shopify theme dev
```

This will:
- Start a local development server
- Watch for file changes
- Sync changes to your development theme

### File Structure

- **Assets**: All static files (CSS, JS, images, fonts)
  - Custom JavaScript components in individual files
  - Base CSS and component-specific styles
  - SVG icons for consistent branding

- **Sections**: Customizable page sections
  - Drag-and-drop in theme editor
  - Schema-based settings

- **Snippets**: Reusable Liquid code
  - Modular components
  - Shared across templates and sections

- **Templates**: Page-level templates
  - JSON templates for flexibility
  - Compatible with Online Store 2.0

## 📦 Key Components

### JavaScript Components

All JavaScript components follow a custom element pattern:
- `cart-drawer.js` - Shopping cart drawer
- `product-form.js` - Product purchase form
- `media-gallery.js` - Product image gallery
- `predictive-search.js` - Search autocomplete
- `variant-picker.js` - Product variant selection
- `slideshow.js` - Image carousel
- And many more...

### CSS Architecture

- `base.css` - Core styles and design tokens
- Component-specific CSS files
- Responsive design patterns
- CSS custom properties for theming

## 🌍 Localization

The theme supports 51 languages with complete translations in the `/locales` directory. Languages include:
- English, Spanish, French, German
- Japanese, Chinese, Korean
- And 44+ more languages

To add a new language:
1. Create a new JSON file in `/locales`
2. Follow the structure of existing locale files
3. Add translations for all theme strings

## 🎨 Customization

### Theme Settings

Configure the theme through the Shopify admin:
1. Go to **Online Store > Themes**
2. Click **Customize** on your theme
3. Use the theme editor to modify:
   - Colors and typography
   - Section layouts
   - Content blocks
   - Navigation menus

### Custom CSS

Add custom styles in `assets/base.css` or create new CSS files in the `/assets` directory.

### Custom JavaScript

Create new component files in `/assets` following the existing pattern:
```javascript
class MyCustomElement extends HTMLElement {
  constructor() {
    super();
    // Your code here
  }
}

customElements.define('my-custom-element', MyCustomElement);
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly in Shopify theme editor
4. Submit a pull request

## 📄 License

This theme is proprietary software. All rights reserved.

## 🆘 Support

For questions or issues:
- Check Shopify's [theme documentation](https://shopify.dev/themes)
- Review the [Liquid reference](https://shopify.dev/api/liquid)
- Contact the development team

## 🔄 Version History

See git commit history for detailed version changes.

---

**Built with ❤️ for Shopify**
