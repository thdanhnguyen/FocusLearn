---
name: Lofi Study Narrative
colors:
  surface: '#fff8f5'
  surface-dim: '#dfd9d6'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f2ef'
  surface-container: '#f3ecea'
  surface-container-high: '#eee7e4'
  surface-container-highest: '#e8e1de'
  on-surface: '#1e1b1a'
  on-surface-variant: '#4a454d'
  inverse-surface: '#33302e'
  inverse-on-surface: '#f6efec'
  outline: '#7b757e'
  outline-variant: '#ccc4ce'
  surface-tint: '#6a5682'
  primary: '#6a5682'
  on-primary: '#ffffff'
  primary-container: '#dbc2f5'
  on-primary-container: '#614d79'
  inverse-primary: '#d5bdef'
  secondary: '#50634b'
  on-secondary: '#ffffff'
  secondary-container: '#d3e9ca'
  on-secondary-container: '#566a51'
  tertiary: '#6c5d39'
  on-tertiary: '#ffffff'
  tertiary-container: '#deca9f'
  on-tertiary-container: '#635532'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eedbff'
  primary-fixed-dim: '#d5bdef'
  on-primary-fixed: '#24123a'
  on-primary-fixed-variant: '#513e68'
  secondary-fixed: '#d3e9ca'
  secondary-fixed-dim: '#b7cdaf'
  on-secondary-fixed: '#0f1f0c'
  on-secondary-fixed-variant: '#394c35'
  tertiary-fixed: '#f5e0b4'
  tertiary-fixed-dim: '#d8c599'
  on-tertiary-fixed: '#241a01'
  on-tertiary-fixed-variant: '#534524'
  background: '#fff8f5'
  on-background: '#1e1b1a'
  surface-variant: '#e8e1de'
typography:
  headline-lg:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin: 32px
  container-max: 1200px
---

## Brand & Style

This design system is built to evoke a sense of a "mental sanctuary." It prioritizes psychological comfort, warmth, and the nostalgic charm of a physical study space. The brand personality is scholarly yet gentle, academic but unhurried, catering to individuals seeking a deep-focus environment free from the "aggressive" urgency of modern productivity tools.

The visual style is a blend of **Tactile Minimalism** and **Warm Minimalism**. It utilizes soft textures, low-contrast color transitions, and a digital interpretation of analog materials like parchment, matte stickers, and ink-on-paper. The emotional goal is to reduce cognitive load and heart rate through a soothing, predictable, and cozy interface.

## Colors

The palette is directly inspired by the nostalgic, sun-drenched atmosphere of a lofi study room. 
- **Primary (Lavender):** Used for active states, primary actions, and "focus" indicators. It represents calm and creativity.
- **Secondary (Sage Green):** Applied to success states, timers, and nature-themed elements to ground the UI.
- **Tertiary (Muted Yellow):** Reserved for highlights, warnings, or "sticky note" components to provide warmth without jarring the user.
- **Background (Parchment):** A warm, off-white base that reduces eye strain compared to pure white, mimicking a physical notebook or aged paper.
- **Text (Dusty Charcoal):** A low-contrast neutral used to ensure readability remains soft and non-confrontational.

## Typography

The typography strategy balances literary sophistication with modern approachability. 

**Newsreader** is the primary choice for headlines and large display text, providing a classic, bookish feel that aligns with the study aesthetic. **Be Vietnam Pro** is utilized for body text and interface labels because its warm, open terminals feel friendly and are highly legible at smaller sizes. 

For a true "lofi" feel, decorative elements or handwritten notes should use a secondary handwriting-style font (where available) or italicized Newsreader to simulate personal annotations. Line heights are intentionally generous to create a relaxed, airy reading experience.

## Layout & Spacing

The layout follows a **fluid grid** model with high internal padding. Components are never "cramped"; instead, they are given significant whitespace to prevent a sense of clutter. 

A 12-column grid is used for desktop views, but elements often span central columns to keep the focus tight and centered. Spacing follows an 8px rhythmic scale, but is applied with "softness"—meaning margins are often slightly larger than expected to maintain the cozy, spacious atmosphere of an organized desk.

## Elevation & Depth

This design system avoids harsh dropshadows. Instead, it uses **Tonal Layering** and **Tinted Ambient Shadows**.

- **Surfaces:** Use subtle shifts in background color (e.g., a slightly darker cream or a very pale lavender) to distinguish between the background and a card.
- **Shadows:** When depth is required, shadows should be highly diffused (30px+ blur) with a very low opacity (5-8%) and tinted with the secondary color (Sage) or a warm brown to avoid "dirty" grey shadows.
- **Glassmorphism:** For floating controllers like music players or timers, use a soft backdrop blur (12px) with a semi-transparent white-cream overlay to simulate a frosted glass or vellum effect.

## Shapes

The shape language is defined by **organic softness**. With a `ROUND_TWELVE` (roundedness: 2) base, all components feel safe and approachable. There are no sharp corners in this system. 

Buttons, tags, and input fields should utilize even more extreme rounding (often pill-shaped) to reinforce the "soft-edged" hand-drawn look. Borders should be thin and slightly darker than the surface color, appearing as if drawn with a fine-liner pen rather than a digital tool.

## Components

- **Buttons:** Pill-shaped with a soft solid fill for primary actions. Secondary actions use a "ghost" style with a 1.5px solid border in the primary color.
- **Cards:** Cards should feature a 1px border in a muted tone. Use slightly irregular or "soft" inner padding to mimic the look of a physical polaroid or paper scrap.
- **Chips/Tags:** Small, rounded rectangles used for categorization. These should use the pastel palette (lavender, sage, or muted yellow) with dark text.
- **Input Fields:** Softly rounded corners with a subtle inner shadow to give a "depressed" tactile feel, as if the paper is slightly indented.
- **Progress Bars:** Thick, rounded bars with a "sketchy" fill texture or a simple solid pastel color, avoiding high-gloss gradients.
- **Music Player:** A signature component featuring large, rounded icons, a frosted glass background, and a simple serif typeface for the track title.