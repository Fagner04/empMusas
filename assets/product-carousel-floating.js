/**
 * Carousel de Produtos com Menu Flutuante - Versão Simplificada
 */

class ProductCarouselFloating {
  constructor(element) {
    this.element = element;
    this.carousel = element.querySelector('[data-product-carousel]');
    this.floatingMenu = element.querySelector('[data-floating-menu]');
    this.menuToggle = element.querySelector('[data-action="toggle-floating-menu"]');
    this.categoryButtons = element.querySelectorAll('[data-action="filter-category"]');
    this.showAllButton = element.querySelector('[data-action="show-all-products"]');
    this.products = element.querySelectorAll('.product-carousel-floating__item');
    
    this.currentFilter = 'all';
    this.isMenuOpen = false;
    this.settings = {};
    
    try {
      this.settings = JSON.parse(element.dataset.sectionSettings || '{}');
    } catch (e) {
      console.warn('Erro ao parsear configurações:', e);
    }
    
    this.init();
  }

  init() {
    console.log('Inicializando carousel com', this.products.length, 'produtos');
    this.attachEventListeners();
    this.initFlickity();
    this.showAllProducts();
  }

  attachEventListeners() {
    // Menu toggle
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMenu();
      });
    }

    // Category filters
    this.categoryButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const collection = e.currentTarget.dataset.collection;
        this.filterByCategory(collection, e.currentTarget);
      });
    });

    // Show all button
    if (this.showAllButton) {
      this.showAllButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.showAllProducts();
      });
    }

    // Outside click
    document.addEventListener('click', (e) => {
      if (this.floatingMenu && !this.floatingMenu.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
        this.menuToggle?.focus();
      }
    });
  }

  initFlickity() {
    if (window.Flickity && this.carousel) {
      try {
        this.flickity = new Flickity(this.carousel, {
          cellAlign: 'left',
          contain: true,
          prevNextButtons: true,
          pageDots: false,
          groupCells: true,
          freeScroll: true,
          wrapAround: false
        });
        console.log('Flickity inicializado com sucesso');
      } catch (error) {
        console.warn('Erro ao inicializar Flickity:', error);
      }
    } else {
      console.warn('Flickity não disponível, usando scroll nativo');
    }
  }

  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    if (!this.floatingMenu) return;

    this.floatingMenu.classList.add('is-open');
    this.isMenuOpen = true;
    
    // Foco no primeiro item do menu
    const firstMenuItem = this.floatingMenu.querySelector('.floating-category-menu__item');
    if (firstMenuItem) {
      setTimeout(() => firstMenuItem.focus(), 100);
    }

    this.menuToggle?.setAttribute('aria-expanded', 'true');
    console.log('Menu aberto');
  }

  closeMenu() {
    if (!this.floatingMenu) return;

    this.floatingMenu.classList.remove('is-open');
    this.isMenuOpen = false;
    this.menuToggle?.setAttribute('aria-expanded', 'false');
    console.log('Menu fechado');
  }

  filterByCategory(collection, button) {
    console.log('Filtrando por categoria:', collection);
    this.currentFilter = collection;
    
    // Atualizar botões ativos
    this.categoryButtons.forEach(btn => btn.classList.remove('is-active'));
    this.showAllButton?.classList.remove('is-active');
    button?.classList.add('is-active');

    // Filtrar produtos
    let visibleCount = 0;
    this.products.forEach(product => {
      const productCollection = product.dataset.collection;
      if (productCollection === collection) {
        product.classList.remove('is-hidden');
        visibleCount++;
      } else {
        product.classList.add('is-hidden');
      }
    });

    console.log('Produtos visíveis:', visibleCount);

    // Atualizar Flickity
    if (this.flickity) {
      setTimeout(() => {
        this.flickity.resize();
        this.flickity.select(0);
      }, 300);
    }

    this.closeMenu();
  }

  showAllProducts() {
    console.log('Mostrando todos os produtos');
    this.currentFilter = 'all';
    
    // Atualizar botões ativos
    this.categoryButtons.forEach(btn => btn.classList.remove('is-active'));
    this.showAllButton?.classList.add('is-active');

    // Mostrar todos os produtos
    this.products.forEach(product => {
      product.classList.remove('is-hidden');
    });

    // Atualizar Flickity
    if (this.flickity) {
      setTimeout(() => {
        this.flickity.resize();
        this.flickity.select(0);
      }, 300);
    }

    this.closeMenu();
  }

  destroy() {
    if (this.flickity) {
      this.flickity.destroy();
      this.flickity = null;
    }
  }
}

// Gerenciador global
window.ProductCarouselFloatingInstances = window.ProductCarouselFloatingInstances || new Map();

// Função de inicialização
function initProductCarouselFloating() {
  console.log('Procurando por carousels...');
  const carouselElements = document.querySelectorAll('[data-section-type="product-carousel-floating"]');
  console.log('Encontrados', carouselElements.length, 'carousels');
  
  carouselElements.forEach(element => {
    const sectionId = element.dataset.sectionId;
    
    // Destruir instância existente se houver
    if (window.ProductCarouselFloatingInstances.has(sectionId)) {
      window.ProductCarouselFloatingInstances.get(sectionId).destroy();
    }
    
    // Criar nova instância
    const instance = new ProductCarouselFloating(element);
    window.ProductCarouselFloatingInstances.set(sectionId, instance);
    console.log('Carousel inicializado para seção:', sectionId);
  });
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductCarouselFloating);
} else {
  initProductCarouselFloating();
}

// Reinicializar quando seções forem recarregadas (Shopify Theme Editor)
document.addEventListener('shopify:section:load', function(event) {
  console.log('Seção carregada:', event.detail.sectionId);
  if (event.detail.sectionId) {
    const element = document.querySelector(`[data-section-id="${event.detail.sectionId}"]`);
    if (element && element.dataset.sectionType === 'product-carousel-floating') {
      const sectionId = event.detail.sectionId;
      
      // Destruir instância existente
      if (window.ProductCarouselFloatingInstances.has(sectionId)) {
        window.ProductCarouselFloatingInstances.get(sectionId).destroy();
      }
      
      // Criar nova instância
      const instance = new ProductCarouselFloating(element);
      window.ProductCarouselFloatingInstances.set(sectionId, instance);
      console.log('Carousel reinicializado para seção:', sectionId);
    }
  }
});

// Limpar instâncias quando seções forem descarregadas
document.addEventListener('shopify:section:unload', function(event) {
  console.log('Seção descarregada:', event.detail.sectionId);
  if (event.detail.sectionId && window.ProductCarouselFloatingInstances.has(event.detail.sectionId)) {
    window.ProductCarouselFloatingInstances.get(event.detail.sectionId).destroy();
    window.ProductCarouselFloatingInstances.delete(event.detail.sectionId);
  }
});

console.log('Script do carousel carregado');