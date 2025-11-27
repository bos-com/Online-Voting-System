# Frontend Styling Guide

This document outlines the styling approach used in this React application.

## Technology Stack

- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Custom CSS Classes**: Defined in `src/index.css` and `src/App.css` for reusable components and custom styles

## Styling Approach

### 1. Tailwind CSS Classes
Use Tailwind utility classes directly in your components for quick styling:

```jsx
<div className="p-4 bg-white rounded shadow">
  <h1 className="text-2xl font-bold text-gray-800">Hello World</h1>
</div>
```

### 2. Custom CSS Classes
For reusable styles and components, we define custom classes in our CSS files:

#### In `src/index.css`:
```css
.btn-primary {
  @apply bg-teal-800 hover:bg-teal-900 text-white font-bold py-2 px-4 rounded;
}

.card {
  @apply bg-white shadow-md rounded-lg p-6 mb-6;
}
```

#### Usage in components:
```jsx
<button className="btn-primary">Click Me</button>
<div className="card">Card content</div>
```

## Available Custom Classes

### Buttons
- `.btn-primary` - Primary action button (teal)
- `.btn-secondary` - Secondary action button (lighter teal)
- `.btn-danger` - Danger/action button (red)
- `.btn-success` - Success button (green)
- `.btn-outline` - Outline button (teal border)

### Layout
- `.card` - Standard card container
- `.card-header` - Card header section
- `.main-layout` - Main layout wrapper
- `.sidebar` - Sidebar navigation
- `.content` - Main content area

### Forms
- `.form-group` - Form group container
- `.form-label` - Form label styling
- `.form-input` - Standard input field
- `.form-select` - Standard select dropdown

### Alerts
- `.alert` - Base alert styling
- `.alert-error` - Error alert
- `.alert-success` - Success alert
- `.alert-warning` - Warning alert

### Navigation
- `.navbar` - Navigation bar
- `.nav-link` - Navigation link
- `.nav-link-active` - Active navigation link

## Color Palette

The application uses a consistent color palette based on teal tones:

- Primary: `#004d40` (teal-800)
- Secondary: `#00796b` (teal-600)
- Accent: `#00bcd4` (cyan-500)
- Light: `#e0f2f1` (teal-50)
- Dark: `#001f1a` (teal-900)

## Best Practices

1. **Consistency**: Use the predefined custom classes whenever possible
2. **Responsive Design**: Utilize Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, etc.)
3. **Accessibility**: Ensure sufficient color contrast and semantic HTML
4. **Performance**: Avoid excessive nesting and overly specific selectors

## Adding New Styles

1. For reusable components, add them to `src/index.css` using the `@apply` directive
2. For page-specific styles, use `src/App.css`
3. For component-specific styles, use Tailwind classes directly in the component