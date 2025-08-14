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
├── _header.json        # AEM component definition
└── README.md           # This documentation

# Test files (for development)
├── nav.html            # Sample AEM navigation fragment
└── test-nav.html       # Test page with nav metadata
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

#### Required AEM Setup

To enable AEM navigation loading, you need:

1. **Navigation Fragment**: Create a navigation fragment in AEM (see `nav.html` for example)
2. **Metadata Tag**: Add `<meta name="nav" content="/path/to/nav">` to your HTML
3. **Content Structure**: Ensure your AEM content follows the expected HTML structure

Example metadata in your HTML:
```html
<head>
    <meta name="nav" content="/nav">
    <!-- other meta tags -->
</head>
```

## Debugging AEM Integration

### Console Logging

The component includes comprehensive logging to help debug AEM integration:

```
🔍 Starting navigation decoration...
📋 Nav metadata found: /nav
🛣️ Loading navigation from path: /nav
📄 Fragment loaded: [HTMLElement]
🔍 Parsing AEM navigation fragment...
📋 Found navigation lists: 1
✅ AEM navigation successfully parsed: {sections: [...]}
🎉 Navigation decoration completed
```

### Common Issues and Solutions

#### 1. Navigation Not Loading from AEM

**Symptoms**: Component uses default menu instead of AEM content
**Debug Steps**:
- Check browser console for error messages
- Verify `<meta name="nav" content="...">` exists in HTML
- Ensure the nav path is accessible (try visiting `/nav` directly)
- Check if `loadFragment()` is working correctly

**Solutions**:
```html
<!-- Add this to your HTML head -->
<meta name="nav" content="/nav">
```

#### 2. Fragment Loading Fails

**Symptoms**: Console shows "Failed to load navigation fragment from AEM"
**Debug Steps**:
- Check network tab for failed requests
- Verify the nav path returns valid HTML
- Ensure the fragment follows expected structure

**Solutions**:
- Create a valid navigation fragment (see `nav.html`)
- Check AEM content permissions and routing
- Verify the fragment path is correct

#### 3. Parsing Fails

**Symptoms**: Fragment loads but shows "no valid menu structure found"
**Debug Steps**:
- Check console for parsing logs
- Verify HTML structure matches expected format
- Look for navigation lists (`<ul>`, `<ol>`) in the fragment

**Solutions**:
- Ensure navigation uses proper HTML list structure
- Check that links have proper `href` attributes
- Verify the fragment contains navigation content

### Testing AEM Integration

1. **Use Test Files**:
   - `test-nav.html` - Test page with nav metadata
   - `nav.html` - Sample AEM navigation fragment

2. **Local Testing**:
   ```bash
   # Start a local server
   python -m http.server 8000
   
   # Open test page
   open http://localhost:8000/test-nav.html
   ```

3. **Console Monitoring**:
   - Open browser developer tools (F12)
   - Check Console tab for navigation logs
   - Look for success/error messages

## Customization

### Colors and Branding

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

### Menu Structure

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

1. Open `test-nav.html` in a web browser to test AEM integration
2. Check browser console for navigation loading logs
3. Resize the browser window to test responsive behavior
4. Use keyboard navigation to test accessibility features

### AEM Development

1. Ensure the component is properly registered in your AEM project
2. Set up the `nav` metadata field to point to your navigation content
3. Create navigation fragments with proper HTML structure
4. Test the component with real AEM content

## Troubleshooting

### Common Issues

1. **Menu not loading**: Check that AEM metadata is properly configured
2. **Styling issues**: Ensure CSS custom properties are supported
3. **JavaScript errors**: Check browser console for module loading issues
4. **AEM integration fails**: Verify navigation fragment structure and metadata

### Debug Mode

The component includes console logging for debugging:

```javascript
// Check if navigation loaded from AEM
console.log('Navigation fragment loaded from AEM:', navPath);

// Check for AEM loading errors
console.warn('Failed to load navigation from AEM, using default:', error);

// Check parsing results
console.log('AEM navigation successfully parsed:', menuData);
```

## License

This component is part of the Sky.com project and follows the project's licensing terms.
