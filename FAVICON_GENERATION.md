# Official BMKG Logo & Favicon Generation Guide

## Overview
This guide explains how to use the **official BMKG logo** from https://www.bmkg.go.id/images/profil/logo-bmkg.png to generate favicons and PWA icons.

## Official Logo Source
- **URL**: https://www.bmkg.go.id/images/profil/logo-bmkg.png
- **Format**: PNG (official format from BMKG website)
- **Usage**: Direct reference in website, local copy for favicon generation

## Files Created
- `download-official-logo.html` - Complete logo downloader and favicon generator
- `generate-favicons.html` - Browser-based favicon generator (updated for official logo)
- `save-official-logo.js` - Script to save logo locally
- Website now uses direct reference to official logo

## Method 1: Complete Solution (Recommended)

1. Open `download-official-logo.html` in your browser
2. Click "Load Official BMKG Logo" - logo will be loaded automatically
3. Click "Generate All Favicons" to create all required sizes
4. Download all generated files:
   - `favicon-16x16.png`
   - `favicon-32x32.png` 
   - `apple-touch-icon.png` (180x180)
   - `icon-192x192.png`, `icon-512x512.png` (PWA)
   - Additional PWA sizes (72x72, 96x96, 128x128, 144x144, 152x152, 384x384)

5. Save all files to the `icons/` directory

## Method 2: Direct Logo Usage

The website now uses the official logo directly from BMKG servers:
```html
<img src="https://www.bmkg.go.id/images/profil/logo-bmkg.png" 
     alt="Logo BMKG" 
     class="w-full h-full object-contain" 
     crossorigin="anonymous" />
```

## Method 3: Online Tools

1. Save the official logo using `save-official-logo.js` or download manually
2. Upload to favicon generators like:
   - https://realfavicongenerator.net/
   - https://favicon.io/
   - https://www.favicon-generator.org/

## Method 3: Command Line (Advanced)

Using ImageMagick:
```bash
# Convert SVG to different sizes
magick images/logo-bmkg.svg -resize 16x16 icons/favicon-16x16.png
magick images/logo-bmkg.svg -resize 32x32 icons/favicon-32x32.png
magick images/logo-bmkg.svg -resize 180x180 icons/apple-touch-icon.png

# Create ICO file
magick icons/favicon-16x16.png icons/favicon-32x32.png favicon.ico
```

## Required Files for Website

### Favicon Files (place in `/icons/` directory):
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

### Root Directory:
- `favicon.ico` (16x16 and 32x32 combined)

## HTML References (Already Updated)

The following favicon references are already included in `index.html`:

```html
<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png">
```

## PWA Manifest (Already Updated)

The `manifest.json` file has been updated to reference all PWA icon sizes.

## Official Logo Implementation

### Current Implementation:
- **Header Logo**: Direct reference to https://www.bmkg.go.id/images/profil/logo-bmkg.png
- **Footer Logo**: Direct reference to https://www.bmkg.go.id/images/profil/logo-bmkg.png  
- **Schema.org**: Updated to reference official logo URL
- **Crossorigin**: Added for proper CORS handling

### Logo Specifications:
- **Source**: Official BMKG website (https://www.bmkg.go.id/images/profil/logo-bmkg.png)
- **Format**: PNG (as provided by BMKG)
- **Usage**: Direct reference with crossorigin attribute for security
- **Fallback**: Local copy can be generated using provided tools

## Required Files for Website

### Favicon Files (place in `/icons/` directory):
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

### Root Directory:
- `favicon.ico` (16x16 and 32x32 combined)

## HTML References (Already Updated)

The website now uses the official BMKG logo directly:

```html
<!-- Header Logo -->
<img src="https://www.bmkg.go.id/images/profil/logo-bmkg.png" 
     alt="Logo BMKG" 
     class="w-full h-full object-contain" 
     crossorigin="anonymous" />

<!-- Favicon Links -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png">
```