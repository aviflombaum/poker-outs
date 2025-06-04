# Poker Outs Calculator PWA

A Progressive Web Application that calculates accurate poker hand probabilities based on outs and the number of players at the table. Unlike traditional shortcuts like the "Rule of 4 and 2", this calculator provides precise percentages that account for multi-way pots.

🎯 **Live Demo**: [pokerouts.app](https://pokerouts.app)

## Features

- **Accurate Probability Calculations**: Precise formulas that adjust for player count (2-9 players)
- **Real-time Updates**: Calculations update as you type your outs
- **Pot Odds Calculator**: Integrated tool to determine profitable calling decisions
- **Progressive Web App**: Install to home screen for offline access
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **SEO Optimized**: Comprehensive strategy guides and poker resources

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Architecture**: Single-page application (SPA)
- **Styling**: BEM methodology with shadcn/ui inspired design
- **PWA Features**: Service worker, manifest file, offline support
- **Build Tool**: Bun for development server

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/poker-outs.git
cd poker-outs

# Install development dependencies
bun install

# Start development server
bunx http-server . -p 8080
```

Visit `http://localhost:8080` to view the application.

## How It Works

### Probability Formulas

**Before Turn (2 cards to come):**
```
1 - ((cardsLeft-outs)/cardsLeft) × ((cardsLeft-1-outs)/(cardsLeft-1))
```

**Before River (1 card to come):**
```
outs/cardsLeft
```

**Cards remaining calculation:**
- 2 players: 45 cards after flop, 44 after turn
- 3 players: 43 cards after flop, 42 after turn
- Each additional player reduces available cards by 2

### Example: Flush Draw (9 outs)
- **2 players**: 36.4% (before turn)
- **9 players**: 48.1% (before turn)
- **Difference**: +11.7% higher odds in full ring vs heads-up

## File Structure

```
/
├── index.html              # Main application page
├── app.js                  # Core JavaScript logic
├── styles.css              # BEM-style CSS
├── manifest.json           # PWA manifest
├── service-worker.js       # PWA service worker
├── icons/                  # PWA icons (72x72 to 512x512)
├── spec.md                 # Technical specifications
├── CLAUDE.md               # Development instructions
└── *.html                  # Strategy guide pages
```

## Development Guidelines

### CSS Architecture
- Use BEM naming convention: `block__element--modifier`
- Mobile-first responsive design
- CSS custom properties for theming
- No external CSS frameworks

### JavaScript Patterns
- Vanilla ES6+ JavaScript only
- Modular function organization
- Event-driven updates
- No build step required

### PWA Requirements
- Installable on mobile and desktop
- Offline functionality via service worker
- 512x512 and 192x192 icons for different contexts
- Manifest with proper metadata

## Strategy Guides

The application includes comprehensive poker strategy content:

- **Why Rule of 4 & 2 Fails**: Multi-way pot calculations
- **Complete Guide to Outs & Odds**: Fundamental probability concepts
- **Cash Game Starting Hands**: Position-based hand selection
- **Implied Odds Guide**: Future value betting strategies
- **Tournament Bankroll Management**: Variance handling techniques

## Common Poker Outs

| Hand Type | Outs | Example |
|-----------|------|---------|
| Flush Draw | 9 | 4 cards of same suit after flop |
| Open-Ended Straight | 8 | Need card on either end |
| Gutshot Straight | 4 | Need one specific rank |
| Two Pair to Full House | 4 | Pair one of your two pairs |
| Set to Full House | 7 | Pair the board or hit your kicker |

## Browser Support

- Modern browsers supporting ES6+
- Service Workers for PWA functionality
- CSS Grid and Flexbox support required
- Responsive design for mobile and desktop

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow BEM CSS conventions
4. Test on multiple devices
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Author

Created by [Avi Flombaum](https://avi.nyc) - [GitHub](https://github.com/aviflombaum)

---

**Disclaimer**: This tool is for educational purposes. Always gamble responsibly. For help with gambling addiction, visit [ncpgambling.org](https://www.ncpgambling.org/help-treatment/).