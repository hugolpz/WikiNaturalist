# Gardens Havens 🌿

Quickly build a gallery of your neighborhood's biodiversity, wikipedia-powered, shareable and collaborative.

💡 The system works best with binomial names, but any topic with Wikimedia data and distinctive names will work. Qid could work too.

## Features

- 🌱 **Gallery of cards**: Rich cards with images, range maps, and descriptions
- ⚙️ **Customizable**: Visibility settings and preferences
- 🌍 **6 Languages**: English, Spanish, Chinese, French, Korean, Japanese
- 👤 **Wikimedia Integration**: Personal species lists and editing
- ✏️ **Editable**: Update your lists as you go
- ✨ **Shareable**: Easy sharing via URL or social media
- 🧑‍🤝‍🧑 **Collaborative**: You may co-edit the lists on wikipedia
- 📱 **Installable**: As mobile & desktop app, always at reach
- 🎨 **Responsive Design**: Optimized for all screen sizes
- 🐣 **Compact/Expanded modes**: For better viewing experience on all devices.
- 🦦 **Kawai!**: Reduced and digest information, friendly design
- 🗽 **Free & open**: it's Wikimedia, it's free & open source, for all.

## Development

### Quick Start

```bash
$ npm install           # Install dependencies
$ npm run dev           # Start development server
$ npm run build         # Build for production
$ npm run preview       # Preview production build
$ npm run lint          # Lint code
$ npm run deploy        # Deploy to GitHub Pages
$ git push              # Triggers GitHub Pages deployment
```

### Project Structure

```
src/
├── components/        # Vue components
├── i18n/              # Internationalization (6 languages)
├── stores/            # Pinia state management
├── utils/             # Data fetching and categorization
└── views/             # Page components

public/
├── assets/            # Static assets and icons
├── manifest.json      # PWA configuration
└── sw.js              # Service worker
```

### Technology

- **Vue.js 3** + **Vite** + **Pinia**
- **APIs**: Wikidata, Wikipedia, Wikimedia Commons
- **Codex**: Wikimedia CSS framework
- **i18n**: vue-i18n for solid multilingual support
- **Progressive Web App** installable, works offline

### GitHub Pages Deployment

Enable GitHub Pages in repository Settings → Pages → Source: "GitHub Actions"

## Browser Support

Modern browsers (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+). No IE support.
