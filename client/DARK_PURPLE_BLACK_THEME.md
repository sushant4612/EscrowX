# Dark Purple & Black Theme

## Updated Color Scheme

### Global Background Gradient

```css
:root {
  --gradient-from: #000000;    /* Pure black */
  --gradient-via: #0f0520;     /* Very dark purple */
  --gradient-to: #1a0a2e;      /* Dark purple */
}
```

### Dashboard Container

```tsx
className="flex h-screen bg-gradient-to-br from-black via-[#0f0520] to-black"
```

Creates a subtle dark purple glow in the center with pure black on the edges.

### Card Backgrounds

```css
.dark-card {
  @apply bg-gradient-to-br from-black/80 to-purple-950/30 
    backdrop-blur-lg border border-purple-950/50;
}

.dark-card-hover {
  @apply bg-gradient-to-br from-black/80 to-purple-950/30 
    backdrop-blur-lg border border-purple-950/50 
    hover:from-black/90 hover:to-purple-900/40 
    hover:border-purple-900/50;
}
```

### Sidebar Components

**Logo Section:**
```tsx
className="p-6 border-b border-purple-950/50 flex justify-center 
  bg-gradient-to-b from-black/50 to-transparent"
```

**Wallet Info:**
```tsx
className="p-6 border-b border-purple-950/50 
  bg-gradient-to-br from-black/60 to-purple-950/20 backdrop-blur-lg"
```

**Balance Card:**
```tsx
className="bg-black/70 rounded-lg p-3 border border-purple-950/70"
```

### Navigation Buttons

**Active State:**
```tsx
className="bg-gradient-to-r from-black/90 to-purple-950/60 
  border border-purple-700/50 text-white shadow-lg shadow-purple-950/50"
```

**Hover State:**
```tsx
className="text-gray-300 hover:bg-black/40"
```

## Color Palette

**Backgrounds:**
- Pure Black: `#000000`
- Very Dark Purple: `#0f0520`
- Dark Purple: `#1a0a2e`

**Gradients:**
- Cards: `from-black/80 to-purple-950/30`
- Active Buttons: `from-black/90 to-purple-950/60`
- Wallet Section: `from-black/60 to-purple-950/20`

**Borders:**
- Primary: `border-purple-950/50`
- Secondary: `border-purple-950/70`
- Active: `border-purple-700/50`

**Text:**
- Primary: `text-white`
- Secondary: `text-gray-300`
- Tertiary: `text-gray-400`
- Accent: `text-purple-400`

## Visual Characteristics

✅ **Extremely Dark:** Almost pure black with subtle purple hints
✅ **Mysterious:** Very dark purple creates an enigmatic atmosphere
✅ **Professional:** Dark theme is easy on the eyes
✅ **Subtle Accents:** Purple is barely visible, creating depth
✅ **High Contrast:** White text pops against dark background
✅ **Glass Morphism:** Subtle blur effects add sophistication
✅ **Minimal Distraction:** Dark colors keep focus on content

## Comparison

**Before:** Medium purple with visible gradients
**After:** Almost pure black with very subtle dark purple accents

The theme is now much darker and more subdued, with purple serving as a subtle accent rather than a dominant color. Perfect for a professional, mysterious, and elegant appearance! 🖤💜
