# Design Guidelines: OnlyOffice Document Integration App

## Design Approach
**Selected Approach:** Design System - Productivity/Utility Focus

This is a utility-focused document editing application where efficiency and clarity are paramount. Drawing inspiration from productivity tools like Notion, Linear, and Google Docs, the design prioritizes functional clarity over decorative elements.

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Background: `220 13% 98%` (soft off-white)
- Surface: `0 0% 100%` (pure white)
- Primary Blue: `217 91% 60%` (vibrant, professional blue)
- Primary Hover: `217 91% 50%`
- Text Primary: `220 13% 18%`
- Text Secondary: `220 9% 46%`
- Border: `220 13% 91%`

**Dark Mode:**
- Background: `220 13% 9%`
- Surface: `220 13% 13%`
- Primary Blue: `217 91% 60%`
- Primary Hover: `217 91% 70%`
- Text Primary: `220 13% 98%`
- Text Secondary: `220 9% 70%`
- Border: `220 13% 20%`

### B. Typography
- **Font Family:** Inter or system fonts (`ui-sans-serif, system-ui, sans-serif`)
- **Button Text:** `text-base font-medium` (16px, 500 weight)
- **Headings (if any):** `text-2xl font-semibold`
- **Body Text:** `text-sm font-normal`

### C. Layout System
**Spacing Units:** Use Tailwind's `4, 6, 8, 12, 16` scale consistently
- Component padding: `p-4` to `p-8`
- Vertical spacing: `space-y-6` or `space-y-8`
- Container margins: `mx-4` or `mx-auto`

**Layout Structure:**
- Initial state: Center content vertically and horizontally in viewport
- Editor state: Full-width layout with minimal chrome

### D. Component Library

**1. Initial State (Before Document Opens):**
- **Container:** Centered flex container (`min-h-screen flex items-center justify-center`)
- **Content Card:** Optional subtle card with `p-12` padding, soft shadow
- **Create Document Button:**
  - Size: `px-8 py-4` (generous click target)
  - Border radius: `rounded-lg`
  - Background: Primary Blue with smooth hover transition
  - Text: White, medium weight
  - Shadow: `shadow-md` on normal, `shadow-lg` on hover
  - Icon: Consider adding document/plus icon before text

**2. Editor State (After Click):**
- **Header Bar:** Fixed top bar with minimal height (`h-14` or `h-16`)
  - Background: Surface color with subtle border-bottom
  - Contains: App title/logo (left), close/minimize button (right)
  - Shadow: `shadow-sm` for subtle depth
- **Editor Container:** 
  - Full width: `w-full`
  - Height: `h-[calc(100vh-4rem)]` (viewport minus header)
  - iframe: `w-full h-full` with `border-0`

**3. Loading State:**
- Spinner: Simple blue spinner centered with "Loading editor..."
- Background: Semi-transparent overlay during transition

### E. Interactions & Animations
**Minimize animations** - this is a productivity tool:
- Button hover: Subtle background color shift (150ms ease)
- Editor load: Simple fade-in (200ms)
- No scroll animations or parallax effects

---

## Key Design Principles

1. **Clarity First:** Every element serves a functional purpose
2. **Instant Feedback:** Button states clearly communicate interactivity
3. **Distraction-Free Editing:** Once editor loads, UI chrome is minimal
4. **Professional Aesthetic:** Clean, modern, trustworthy appearance
5. **Accessibility:** High contrast ratios, clear focus states, keyboard navigation

---

## Specific Implementation Notes

- **No Hero Section:** This is not a marketing page - start with the functional button
- **No Images:** Unnecessary for this utility app
- **Responsive:** Button and editor should work seamlessly on desktop (primary target)
- **Focus Management:** When editor loads, focus should move to the editor iframe
- **Error States:** If editor fails to load, show clear error message with retry option

---

## Visual Hierarchy
1. **Primary Action:** "Create Document" button (largest, most prominent)
2. **Editor:** Takes over full viewport when active
3. **Chrome/Navigation:** Minimal, unobtrusive when editor is open

This design ensures users can quickly access document editing functionality while maintaining a professional, clean interface that doesn't compete with the OnlyOffice editor itself.