# WikiDex 🌿

Easily build a gallery of your neighborhood's biodiversity, wikipedia-powered, shareable and collaborative.

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
```

### Deployment

**GitHub Pages** (automatic via GitHub Actions):

```bash
$ git push              # Triggers automatic deployment
# Builds with base: /wikidex/
# Deploys to: https://hugolpz.github.io/wikidex/
```

**Toolforge** (automatic via GitHub Actions):

```bash
$ git push              # Triggers automatic deployment
# Builds with base: / (root path)
# Requires secrets: SSH_PRIVATE_KEY, TOOLFORGE_USERNAME, TOOLFORGE_HOST
# Deploys to: https://wikidex.toolforge.org/
```

**Manual Toolforge Build**:

```bash
$ npm run build -- --mode toolforge
# Builds for root path deployment
```

### Project Structure

```
src/
├── views/             # Page components
├── components/        # Vue components
├── i18n/              # Internationalization (7 languages)
├── stores/            # Pinia state management
└── utils/             # Script for data fetching, categorization, etc.

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

### Deployment Targets

1. **GitHub Pages**: https://hugolpz.github.io/wikidex/
   - Base path: `/wikidex/`
   - Auto-deploys on push to `main`

2. **Toolforge**: https://wikidex.toolforge.org/
   - Base path: `/` (root)
   - Auto-deploys on push to `main`
   - Requires GitHub secrets configuration

## Browser Support

Modern browsers (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+). No IE support.
