# Sky.com Navigation Header Component

A modern, responsive navigation header component designed for Sky.com, built with Adobe Experience Manager (AEM) Edge Delivery Services and the Adobe Helix framework.

## Features

- **Responsive Design**: Mobile-first approach with hamburger menu for mobile devices
- **Sky Branding**: Custom Sky.com color scheme and typography
- **Dropdown Menus**: Hover-based dropdown navigation for desktop
- **AEM Integration**: Designed to pull menu content from AEM using X-Walk
- **Accessibility**: Full keyboard navigation support and ARIA attributes
- **Modern UI**: Clean, professional design with smooth animations

## File Structure

```
blocks/header/
├── header.css          # Main stylesheet with Sky.com branding
├── header.js           # JavaScript functionality and AEM integration
├── header.html         # Sample HTML for testing/demo
├── _header.json        # AEM component definition
└── README.md           # This documentation
```

## Usage

### Basic Implementation

The navigation component automatically creates a complete header when the `decorate` function is called:

```javascript
import decorate from './blocks/header/header.js';

// Decorate the header block
const headerBlock = document.querySelector('header');
await decorate(headerBlock);
```

### AEM Integration

The component is designed to work with AEM Edge Delivery Services:

1. **Menu Content**: Navigation menu items are stored in AEM using the X-Walk project structure
2. **Metadata**: The component looks for a `nav` metadata field to load navigation content
3. **Fallback**: If AEM content isn't available, it uses a default Sky.com menu structure

### Customization

#### Colors and Branding

The component uses CSS custom properties for easy theming:

```css
:root {
  --sky-blue: #0070d2;        /* Primary Sky blue */
  --sky-dark-blue: #0056b3;   /* Darker blue for hover states */
  --sky-light-blue: #e6f3ff;  /* Light blue for backgrounds */
  --sky-gray: #6b7280;        /* Text and border colors */
  --sky-white: #ffffff;       /* Background colors */
}
```

#### Menu Structure

The default menu structure can be modified in the `SKY_NAV_CONFIG` object:

```javascript
const SKY_NAV_CONFIG = {
  brand: {
    name: 'Sky',
    logo: '/icons/sky-logo.svg',
    url: '/'
  },
  defaultMenu: {
    sections: [
      {
        title: 'TV',
        url: '/tv',
        children: [
          { title: 'Sky Q', url: '/tv/sky-q' },
          // ... more items
        ]
      }
      // ... more sections
    ]
  }
};
```

## Responsive Behavior

### Desktop (≥900px)
- Horizontal navigation with dropdown menus
- Hover-based dropdown activation
- Full menu visible at all times

### Mobile (<900px)
- Hamburger menu for navigation
- Vertical stacked menu items
- Full-screen overlay when expanded
- Touch-friendly interactions

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all navigation elements
- **ARIA Attributes**: Proper ARIA labels and expanded states
- **Focus Management**: Logical tab order and focus indicators
- **Screen Reader Support**: Semantic HTML structure and ARIA landmarks

## Browser Support

- Modern browsers with ES6+ support
- CSS Grid and Flexbox support required
- CSS custom properties (CSS variables) support required

## Dependencies

- Adobe Helix framework
- AEM Edge Delivery Services
- Modern CSS features (Grid, Flexbox, Custom Properties)

## Development

### Local Testing

1. Open `header.html` in a web browser to see the component in action
2. Resize the browser window to test responsive behavior
3. Use keyboard navigation to test accessibility features

### AEM Development

1. Ensure the component is properly registered in your AEM project
2. Set up the `nav` metadata field to point to your navigation content
3. Test the component with real AEM content

## Troubleshooting

### Common Issues

1. **Menu not loading**: Check that AEM metadata is properly configured
2. **Styling issues**: Ensure CSS custom properties are supported
3. **JavaScript errors**: Check browser console for module loading issues

### Debug Mode

The component includes console logging for debugging:

```javascript
// Check if navigation loaded from AEM
console.log('Navigation fragment loaded from AEM:', navPath);

// Check for AEM loading errors
console.warn('Failed to load navigation from AEM, using default:', error);
```

## License

This component is part of the Sky.com project and follows the project's licensing terms.
