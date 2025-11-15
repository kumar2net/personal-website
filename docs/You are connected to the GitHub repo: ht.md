You are connected to the GitHub repo: https://github.com/kumar2net/personal-website

Create a new commit directly on master that implements full Material UI v7 (Material 3) color-scheme support.

Tasks:

1. Modify the theme file `/src/theme.ts`:
   - Use experimental_extendTheme.
   - Enable cssVariables: { colorSchemeSelector: "class" }.
   - Add colorSchemes with light and dark palettes.
   - Add updated Material 3 typography scale.
   - Export the theme.

2. Modify `/src/main.tsx`:
   - Import CssBaseline from @mui/material.
   - Wrap the app in <ThemeProvider theme={theme}>.
   - Add <CssBaseline enableColorScheme />.
   - Ensure no duplicate ThemeProvider exists.

3. Add color scheme utilities:
   - Add new file `/src/utils/colorMode.ts` with a function applyColorScheme(scheme) that sets the <html> class to light or dark.

4. Update `/index.html`:
   - Add: 
     <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff">
     <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0B0B0F">

5. Add a demo component:
   - Create `/src/components/ThemeDemo.tsx`
   - Component displays:
        - A card using background: var(--mui-palette-background-paper)
        - Text using var(--mui-palette-text-primary)
        - A button that toggles light/dark using applyColorScheme
   - Export the component.

6. Add the ThemeDemo to any existing page route (e.g. home or /blog) without breaking layout.

7. Run typecheck and autofix formatting before committing.

8. Create a commit with message:
   "feat: add full Material 3 light/dark color scheme with css variables + theme-color metadata"

Execute everything now.
