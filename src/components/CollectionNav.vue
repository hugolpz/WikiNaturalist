<template>
  <nav class="collection-nav">
    <a
      v-for="(collection, index) in collections"
      :key="`nav-${collection.collectionTitle}`"
      :href="`#collection-${index + 1}`"
      class="collection-nav-link"
      @click.prevent="scrollToCollection(index + 1)"
    >
      <span class="nav-icon">🌿</span>
      <span class="nav-text">{{ collection.collectionTitle }}</span>
      <span class="nav-count">{{ collection.list.length }}</span>
    </a>
  </nav>
</template>

<script setup>
// Define component properties
defineProps({
  collections: {
    type: Array,
    required: true,
    default: () => [],
  },
})

/**
 * Scroll smoothly to a specific collection
 */
const scrollToCollection = (index) => {
  const element = document.getElementById(`collection-${index}`)
  if (element) {
    const navHeight = 60 // Height of sticky nav
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - navHeight - 20

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
}
</script>

<style scoped>
/* Collection Navigation */
.collection-nav {
  position: sticky;
  top: 0; /* Stick to very top, overlap TopBar */
  z-index: 101; /* sit above TopBar */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 0 0 12px 12px;
}

.collection-nav::-webkit-scrollbar {
  height: 6px;
}

.collection-nav::-webkit-scrollbar-track {
  background: transparent;
}

.collection-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.collection-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.collection-nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  white-space: nowrap;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.collection-nav-link:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.collection-nav-link:active {
  transform: translateY(0);
}

.nav-icon {
  font-size: 1.1rem;
}

.nav-text {
  font-weight: 600;
}

.nav-count {
  background: rgba(255, 255, 255, 0.25);
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .collection-nav {
    top: 0;
    padding: 0.75rem;
    gap: 0.5rem;
    border-radius: 0;
  }

  .collection-nav-link {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .nav-count {
    font-size: 0.7rem;
    padding: 0.1rem 0.4rem;
  }
}

@media (max-width: 480px) {
  .collection-nav {
    top: 0;
    gap: 0.4rem;
  }

  .collection-nav-link {
    padding: 0.35rem 0.7rem;
    font-size: 0.75rem;
    gap: 0.4rem;
  }

  .nav-icon {
    font-size: 1rem;
  }

  .nav-count {
    font-size: 0.65rem;
  }
}
</style>
