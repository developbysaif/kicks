# KICK Home Care — Design System & Tokens (`docs/THEME.md`)

This document records the exact frozen visual design system of KICK Home Care. All new UI elements must reuse these exact tokens. Do not invent new colors, fonts, or component styles.

---

## 1. Brand Identity
- **Brand Name**: KICK Home Care
- **Tagline**: *Kara Asani Zindagi Main*
- **Currency**: PKR (`Rs. 1,250`)
- **Logo**: `/kick%20logo.png`
- **Favicon**: `/fav-icon-kick.png`

---

## 2. Color Palette

### Primary & Brand Colors
- **Brand Red (Primary Accent)**: `#DC2626` (`bg-red-600`, `text-red-600`, `hover:bg-red-700`)
- **Deep Red Dark**: `#991B1B` (`red-800`), `#7F1D1D` (`red-900`), `#450A0A` (`red-950`)
- **Red Soft Tint**: `#FEF2F2` (`bg-red-50`), `#FEE2E2` (`border-red-100`)

### Neutral & Slate Palette
- **Deep Slate / Brand Dark**: `#0F172A` (`slate-900`)
- **Footer Background**: `#0B1D33`
- **Slate Accent**: `#1E293B` (`slate-800`)
- **Body Text**: `#1E293B` (`slate-800`), `#334155` (`slate-700`)
- **Muted Text**: `#64748B` (`slate-500`), `#94A3B8` (`slate-400`)
- **Borders & Dividers**: `#E2E8F0` (`slate-200`), `#F1F5F9` (`slate-100`)
- **Backgrounds**: `#FFFFFF` (White), `#F8FAFC` (`slate-50`), `#F1F5F9` (`slate-100`)

### Extended Category Accent Gradients
- **Laundry Care**: `from-blue-900 to-indigo-950`
- **Home Cleaning**: `from-emerald-900 to-teal-950`
- **Dish Care**: `from-amber-900 to-yellow-950`
- **Washroom Cleaning**: `from-slate-900 to-indigo-950`
- **Mosquito Protection**: `from-purple-900 to-slate-950`
- **Shoe Care**: `from-slate-900 to-red-950`

---

## 3. Typography
- **Primary Font Family**: `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Font Sizes**:
  - `text-[10px]`: Micro labels / badge counts (`0.625rem`)
  - `text-[11px]`: Sub-caption & SKU codes (`0.6875rem`)
  - `text-xs`: Secondary descriptions, timestamps, table cells (`0.75rem`)
  - `text-sm`: Form labels, nav links, card titles (`0.875rem`)
  - `text-base`: Body prose, standard inputs (`1rem`)
  - `text-lg`: Section headers, modal titles (`1.125rem`)
  - `text-xl`: Subsection headings, price tags (`1.25rem`)
  - `text-2xl`: Page headings, stat highlights (`1.5rem`)
  - `text-3xl`: Hero headlines, banner titles (`1.875rem`)
- **Font Weights**:
  - `font-medium`: 500
  - `font-semibold`: 600
  - `font-bold`: 700
  - `font-black` / `font-extrabold`: 800-900 (used extensively for KICK brand headers and price values)

---

## 4. Spacing & Container Widths
- **Max Width**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (`1280px`)
- **Narrow Containers (Account / Auth / Checkout)**: `max-w-md`, `max-w-2xl`, `max-w-4xl`
- **Card Padding**: `p-4 sm:p-6`
- **Section Spacing**: `py-10 sm:py-16`

---

## 5. Border Radius & Shadows
- **Rounded Corners**:
  - Inputs / Buttons: `rounded-xl` (`0.75rem`), `rounded-2xl` (`1rem`), or `rounded-full` (`9999px`)
  - Cards & Containers: `rounded-2xl` (`1rem`), `rounded-3xl` (`1.5rem`)
  - Badges & Pills: `rounded-full`
- **Shadows**:
  - `shadow-xs`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
  - `shadow-sm`: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)`
  - `shadow-md`: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)`
  - `shadow-lg`: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)`
  - `shadow-card`: `0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)`
  - `shadow-card-hover`: `0 20px 30px -10px rgba(15, 118, 110, 0.12), 0 8px 12px -6px rgba(15, 23, 42, 0.06)`

---

## 6. Component Tokens

### Buttons
- **Primary Button**: `bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider py-3 px-6 rounded-full transition-all shadow-sm flex items-center justify-center gap-2`
- **Secondary / Ghost Button**: `bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-5 rounded-full transition-all`
- **Admin Button**: `bg-slate-900 hover:bg-red-600 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-sm`
- **Icon Button**: `p-2 rounded-full hover:bg-slate-100 text-slate-700 hover:text-red-600 transition-colors`

### Inputs & Forms
- **Text Inputs**: `w-full py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all placeholder:text-gray-400`
- **Form Labels**: `block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2`
- **Validation Errors**: `text-xs font-bold text-red-600 mt-1`

### Cards
- **Product Card**: White background, `rounded-2xl` or `rounded-3xl`, `border border-slate-200/80`, hover elevation (`hover-lift`, `hover:shadow-card-hover`).
- **Admin Stat Card**: White background, `rounded-2xl`, `p-6`, `border border-slate-200`, flex row with icon badge and large bold metric.

### Badges & Status Indicators
- **Discount Badge**: `bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm`
- **Status 'Pending'**: `bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2.5 py-1 rounded-full`
- **Status 'Delivered' / 'Approved'**: `bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-1 rounded-full`
- **Status 'Cancelled' / 'Rejected'**: `bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold px-2.5 py-1 rounded-full`

---

## 7. Responsive Breakpoints
- `xs`: 480px
- `sm`: 640px
- `md`: 768px (Tablet view captured in baseline)
- `lg`: 1024px (Desktop header & sidebar transition)
- `xl`: 1280px (Standard desktop container)
- `2xl`: 1536px
