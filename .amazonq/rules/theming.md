# Theming Rules — Dark & Light Mode

## Strategy
- Use Tailwind CSS `dark:` variant for all theme-aware styling
- Toggle theme by adding/removing the `dark` class on the `<html>` element
- Store the user's preference in `localStorage` under the key `theme`
- Respect the system preference via `prefers-color-scheme` as the default when no stored preference exists

## Color Palette
- Dark background: `bg-gray-900`, surfaces: `bg-gray-800`, borders: `border-gray-700`
- Light background: `bg-white`, surfaces: `bg-gray-50`, borders: `border-gray-200`
- Primary accent (both themes): amber — `amber-500` for actions, `amber-400` for hover
- Text dark theme: `text-gray-100` (primary), `text-gray-400` (secondary)
- Text light theme: `text-gray-900` (primary), `text-gray-500` (secondary)

## Implementation Rules
- Every color utility that differs between themes MUST have a corresponding `dark:` variant (e.g. `bg-white dark:bg-gray-900`)
- Never hardcode a single-theme color without its counterpart — all components must work in both themes
- Use a shared `ThemeService` (singleton, `providedIn: 'root'`) to manage theme state with a signal
- The `ThemeService` must expose: `theme` signal (`'light' | 'dark'`), `toggleTheme()`, and `isDark` computed signal
- Components should NOT manage theme logic directly — always delegate to `ThemeService`

## Tailwind Config
- Ensure `darkMode: 'class'` is set in the Tailwind configuration

## Accessibility
- Maintain a minimum contrast ratio of 4.5:1 for text in both themes
- Theme toggle button must have an `aria-label` describing the current action (e.g. "Switch to dark mode")

## Transitions
- Apply `transition-colors duration-200` on `<html>` or `<body>` for smooth theme switches
