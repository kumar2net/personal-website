# @kumar2net/ui-theme

Material 3 theme primitives for the personal website. Import the default export to access the shared theme or use the provided `ThemeProvider` helper.

```tsx
import theme, { ThemeProvider } from "@kumar2net/ui-theme";

function AppProviders({ children }) {
  return <ThemeProvider defaultMode="system">{children}</ThemeProvider>;
}
```
