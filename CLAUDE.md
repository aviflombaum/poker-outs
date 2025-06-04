# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Poker Outs Percentages PWA - A single-page application that calculates poker hand probabilities based on player count and outs.

## Tech Stack

- Vanilla JavaScript (ES6+)
- HTML5
- CSS3 with BEM conventions
- Progressive Web App (PWA) features

## Development Commands

```bash
# Install development dependencies (if any)
bun install

# Run local development server
bunx http-server . -p 8080

# Run tests (when implemented)
# bun test
```

## Architecture

This is a client-side only PWA with:
- Single HTML page application
- Real-time probability calculations using formulas from spec.md
- No backend/API required - all calculations done client-side
- PWA manifest and service worker for offline functionality

## Key Implementation Details

### Probability Formulas

**Before Turn (2 cards to come):**
```
1 - ((cardsLeft-outs)/cardsLeft) × ((cardsLeft-1-outs)/(cardsLeft-1))
```

**Before River (1 card to come):**
```
outs/cardsLeft
```

Where `cardsLeft` depends on player count:
- 2 players: 45 cards after flop, 44 after turn
- 3 players: 43 cards after flop, 42 after turn
- ... (subtract 2 for each additional player)

### CSS Architecture

- Use BEM naming convention for all CSS classes
- Style inspired by shadcn/ui but implemented in vanilla CSS
- No CSS frameworks or preprocessors

### File Structure

```
/
├── index.html          # Main HTML file
├── styles.css          # BEM-style CSS
├── app.js             # Main application logic
├── manifest.json      # PWA manifest
├── service-worker.js  # PWA service worker
└── icons/            # PWA icons
```

## Development Guidelines

1. Keep the implementation simple and focused on the core functionality
2. Ensure PWA compliance (manifest, service worker, HTTPS-ready)
3. Use semantic HTML5 elements
4. Follow BEM naming for CSS classes (block__element--modifier)
5. Calculate percentages on input change without requiring a button click
6. Support player counts 2-9 and out counts 1-10 as per spec.md