# Dubai Estate Styling & Theming Documentation

This document outlines the styling architecture for the Dubai Estate project. It is intended to be a guide for developers and AI models to understand and contribute to the project's UI.

The project uses a hybrid approach combining **Tailwind CSS** for utility-first styling, **Shadcn/UI** for a base component library, and a custom CSS variable system for robust theming with **light and dark modes**. Theming is managed by `next-themes`.

## File Structure

All global styles are located in `src/app/` and organized as follows:

-   **`globals.css`**: The main entry point that imports all other style sheets into the application.
-   **`styles/variables.css`**: The core of the theming system. It defines all CSS custom properties (variables) for colors, spacing, and radii for both light and dark themes.
-   **`styles/base.css`**: Defines base styles for the entire application, such as default text color, background color, and global element styles (e.g., `*`, `body`). It also includes a smooth transition for theme changes.
-   **`styles/components.css`**: Contains custom component classes built on top of Tailwind's `@layer components`. These are reusable styles for elements like buttons (`.btn-primary`), cards (`.property-card`), and logos.
-   **`styles/prose-styles.css`**: Provides styling for long-form content, typically rendered from Markdown or a headless CMS (e.g., blog posts). It ensures consistent typography for headings, paragraphs, lists, etc.
-   **`styles/tiptap-editor.css`**: Contains specific styles for the TipTap rich-text editor, ensuring the editor's appearance matches the site's theme.
-   **`styles/utilities.css`**: Includes custom utility classes and other miscellaneous styles, such as print-specific styles (`@media print`).

## Theming Strategy

Theming is powered by `next-themes`, which toggles a `.dark` class on the `<html>` element. Our CSS architecture leverages this to apply different styles for light and dark modes.

The heart of the theming system is **`src/app/styles/variables.css`**. This file defines two main sets of CSS variables:

1.  `:root`: Defines the variables for the **light theme**.
2.  `.dark`: Overrides the same variables for the **dark theme**.

We use the modern **OKLCH color format** for defining our color palette. OKLCH provides more intuitive and consistent color manipulation compared to traditional formats like HSL or RGB.

### Color Systems

The project utilizes two parallel color systems defined in `variables.css`:

1.  **Shadcn/UI System**: We define the standard set of variables expected by Shadcn/UI components (e.g., `--background`, `--foreground`, `--primary`, `--card`, `--muted`, etc.). This allows us to use Shadcn components out-of-the-box while ensuring they match our custom theme.
2.  **Dubai Estate Design System**: This is a custom set of variables created specifically for the project's brand identity. These variables are more semantic to the project's design language.
    *   `--golden-accent`: The primary brand accent color.
    *   `--design-black` / `--design-white`: These are semantic colors that invert in dark mode to maintain contrast. For example, `--design-black` is `#000000` in light mode but `#ffffff` in dark mode.
    *   `--design-section-*`: Variables for section backgrounds with different shades.

## CSS Variables Reference

The following table details the primary CSS variables used in the project, their values in both light and dark themes, and their intended purpose.

| Variable | Light Value (`:root`) | Dark Value (`.dark`) | Purpose/Usage |
| :--- | :--- | :--- | :--- |
| **Shadcn/UI - Core** | | | |
| `--background` | `oklch(1 0 0)` | `oklch(0.13 0.028 261.692)` | Main page background color. |
| `--foreground` | `oklch(0.13 0.028 261.692)` | `oklch(0.985 0.002 247.839)` | Default text color. |
| `--primary` | `oklch(0.21 0.034 264.665)` | `oklch(0.928 0.006 264.531)` | Primary interactive elements (e.g., buttons). |
| `--primary-foreground` | `oklch(0.985 0.002 247.839)` | `oklch(0.21 0.034 264.665)` | Text on primary-colored elements. |
| `--secondary` | `oklch(0.967 0.003 264.542)` | `oklch(0.278 0.033 256.848)` | Secondary interactive elements. |
| `--secondary-foreground` | `oklch(0.21 0.034 264.665)` | `oklch(0.985 0.002 247.839)` | Text on secondary-colored elements. |
| `--card` | `oklch(1 0 0)` | `oklch(0.21 0.034 264.665)` | Background color for cards. |
| `--card-foreground` | `oklch(0.13 0.028 261.692)` | `oklch(0.985 0.002 247.839)` | Text color within cards. |
| `--muted` | `oklch(0.967 0.003 264.542)` | `oklch(0.278 0.033 256.848)` | Muted elements and backgrounds. |
| `--muted-foreground` | `oklch(0.551 0.027 264.364)` | `oklch(0.707 0.022 261.325)` | Text on muted elements. |
| `--accent` | `oklch(0.967 0.003 264.542)` | `oklch(0.278 0.033 256.848)` | Accent color for highlights. |
| `--accent-foreground` | `oklch(0.21 0.034 264.665)` | `oklch(0.985 0.002 247.839)` | Text on accent-colored elements. |
| `--border` | `oklch(0.928 0.006 264.531)` | `oklch(1 0 0 / 10%)` | Default border color. |
| `--input` | `oklch(0.928 0.006 264.531)` | `oklch(1 0 0 / 15%)` | Input field border/background. |
| `--ring` | `oklch(0.707 0.022 261.325)` | `oklch(0.551 0.027 264.364)` | Focus ring color. |
| **Dubai Estate - Design System** | | | |
| `--golden-accent` | `#f5c842` | `#f5c842` | Primary brand accent color (e.g., logos, highlights). |
| `--navigation-bg` | `#333333` | `#1a1a1a` | Background for navigation bars. |
| `--section-bg-light` | `#fafafa` | `#0a0a0a` | Background for light sections. |
| `--section-bg-dark` | `#1e293b` | `#000000` | Background for dark sections. |
| `--header-border` | `#ededed` | `#333333` | Border color for the main header. |
| `--design-black` | `#000000` | `#ffffff` | Semantic black. Inverts for dark mode. Used for primary text/UI. |
| `--design-white` | `#ffffff` | `#000000` | Semantic white. Inverts for dark mode. Used for backgrounds/UI. |
| `--design-dark-grey` | `#333333` | `#e5e5e5` | Dark grey shade for UI elements. |
| `--design-medium-grey` | `#444444` | `#d4d4d4` | Medium grey shade for UI elements. |
| `--design-light-grey` | `#f5f5f5` | `#0a0a0a` | Light grey shade, often for backgrounds or borders. |
| `--design-section-light` | `#fafafa` | `#000000` | Background for the lightest sections. |
| `--design-section-medium`| `#ededed` | `#1a1a1a` | Background for medium-shaded sections. |
| **Sizing** | | | |
| `--radius` | `0.625rem` | `0.625rem` | Base border radius for components. |
