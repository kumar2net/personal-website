# Material 3 Theme Migration (Visual Parity)

This repo now exposes Material Design 3 **container roles** in a non-breaking way while preserving the existing look and existing `theme.palette.*` access patterns.

## Old Palette Tokens (Primitives)

Source: `packages/ui-theme/colorTokens.ts`

- Brand / accents: `primary`, `onPrimary`, `primaryContainer`, `onPrimaryContainer`, `secondary`, `onSecondary`, `secondaryContainer`, `onSecondaryContainer`, `tertiary`, `onTertiary`, `tertiaryContainer`, `onTertiaryContainer`
- Surfaces: `surface`, `surfaceContainer`, `surfaceContainerHigh`, `surfaceVariant`
- Text: `onSurface`, `onSurfaceVariant`
- Background: `background`, `onBackground`
- Inverse: `inverseSurface`, `inverseOnSurface`, `inversePrimary`
- Outlines: `outline`, `outlineVariant`
- Status: `success`, `onSuccess`, `warning`, `onWarning`, `error`, `onError`
- Neutral: `neutral`

## New Material 3 Role Mappings (Additive)

Source: `packages/ui-theme/theme.ts`

### Legacy MUI palette (unchanged)

These are preserved to avoid breaking existing code:

- `theme.palette.primary.main` → `colorTokens.primary[mode]`
- `theme.palette.primary.contrastText` → `colorTokens.onPrimary[mode]`
- `theme.palette.secondary.main` → `colorTokens.secondary[mode]`
- `theme.palette.secondary.contrastText` → `colorTokens.onSecondary[mode]`
- `theme.palette.background.default` → `colorTokens.background[mode]`
- `theme.palette.background.paper` → `colorTokens.surface[mode]`
- `theme.palette.text.primary` → `colorTokens.onSurface[mode]`
- `theme.palette.text.secondary` → `colorTokens.onSurfaceVariant[mode]`
- `theme.palette.divider` → `colorTokens.outlineVariant[mode]`

### Material 3 container roles (new)

Accessible via `theme.palette.m3`:

- `theme.palette.m3.primaryContainer` → `colorTokens.primaryContainer[mode]`
- `theme.palette.m3.onPrimaryContainer` → `colorTokens.onPrimaryContainer[mode]`
- `theme.palette.m3.secondaryContainer` → `colorTokens.secondaryContainer[mode]`
- `theme.palette.m3.onSecondaryContainer` → `colorTokens.onSecondaryContainer[mode]`

## Safe Usage Guidelines (Future Components)

### Keep existing patterns working

- Keep using `theme.palette.primary.main` and `theme.palette.primary.contrastText` for classic MUI component color props (`color="primary"`, contained buttons, etc).
- Keep using `sx` shorthands like `bgcolor: "primary.main"` and `color: "primary.contrastText"` when you want the “brand” color fill behavior.

### Use Material 3 container roles for tinted surfaces

Use these when a component needs a **tonal container** (a lightly tinted background) instead of a full brand fill:

- Container background: `theme.palette.m3.primaryContainer`
- Foreground content (text/icons) on that surface: `theme.palette.m3.onPrimaryContainer`

Examples (recommended intent):

```tsx
sx={(theme) => ({
  backgroundColor: theme.palette.m3.primaryContainer,
  color: theme.palette.m3.onPrimaryContainer,
})}
```

### Avoid “alpha(primary.main)” as a long-term pattern

Existing code uses `alpha(theme.palette.primary.main, …)` for subtle background tints. That is OK for now (visual parity), but prefer M3 container roles in new components so:

- the “tint” is consistent across light/dark modes,
- text contrast is handled via the paired `on*` role,
- intent is clearer in code review (container vs brand fill).

