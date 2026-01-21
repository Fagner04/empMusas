/**
 * Carousel de Produtos com Menu Flutuante
 * Funcionalidade avançada para exibir produtos com filtros por categoria
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
    this.settings = JSON.parse(element.dataset.sectionSettings || '{}');
    this.autoplayInterval = null;
    this.isDestroyed = false;
    
    this.init();
  }

  init() {
    if (this.isDestroyed) return;
    
    this.attachEventListeners();
    this.initFlickity();
    this.setupAutoplay();
    this.showAllProducts(); // Inicializar com todos os produtos visíveis
    this.setupIntersectionObserver();
  }

  attachEventListeners() {
    // Menu toggle
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', this.handleMenuToggle.bind(this));
    }

    // Category filters
    this.categoryButtons.forEach(button => {
      button.addEventListener('click', this.handleCategoryFilter.bind(this));
    });

    // Show all button
    if (this.showAllButton) {
      this.showAllButton.addEventListener('click', this.handleShowAll.bind(this));
    }

    // Outside click
    document.addEventListener('click', this.handleOutsideClick.bind(this));

    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeydown.bind(this));

    // Autoplay controls
    if (this.carousel) {
      this.carousel.addEventListener('mouseenter', this.pauseAutoplay.bind(this));
      this.carousel.addEventListener('mouseleave', this.resumeAutoplay.bind(this));
    }

    // Resize handler
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleMenuToggle(e) {
    e.preventDefault();
    this.toggleMenu();
  }

  handleCategoryFilter(e) {
    e.preventDefault();
    const collection = e.currentTarget.dataset.collection;
    this.filterByCategory(collection, e.currentTarget);
  }

  handleShowAll(e) {
    e.preventDefault();
    this.showAllProducts();
  }

  handleOutsideClick(e) {
    if (this.floatingMenu && !this.floatingMenu.contains(e.target)) {
      this.closeMenu();
    }
  }

  handleKeydown(e) {
    if (e.key === 'Escape' && this.isMenuOpen) {
      this.closeMenu();
      this.menuToggle?.focus();
    }
  }

  handleResize() {
    if (this.flickity) {
      this.flickity.resize();
    }
  }

  initFlickity() {
    if (!window.Flickity || !this.carousel) return;

    try {
      this.flickity = new Flickity(this.carousel, {
        cellAlign: 'left',
        contain: true,
        prevNextButtons: true,
        pageDots: false,
        groupCells: true,
        freeScroll: true,
        wrapAround: false,
        adaptiveHeight: false,
        dragThreshold: 10,
        selectedAttraction: 0.025,
        friction: 0.28,
        accessibility: true,
        setGallerySize: false
      });

      // Eventos do Flickity
      this.flickity.on('staticClick', this.handleFlickityClick.bind(this));
      this.flickity.on('change', this.handleFlickityChange.bind(this));
      
    } catch (error) {
      console.warn('Erro ao inicializar Flickity:', error);
    }
  }

  handleFlickityClick(event, pointer, cellElement, cellIndex) {
    if (!cellElement) return;
    
    // Permitir navegação normal para links de produtos
    const productLink = cellElement.querySelector('a');
    if (productLink && event.target.closest('a')) {
      return;
    }
  }

  handleFlickityChange(index) {
    // Callback para mudanças de slide
    this.announceSlideChange(index);
  }

  setupAutoplay() {
    if (!this.settings.autoplay) return;

    this.autoplayInterval = setInterval(() => {
      if (!this.isMenuOpen && this.flickity && !this.isDestroyed) {
        this.flickity.next();
      }
    }, this.settings.autoplaySpeed || 5000);
  }

  pauseAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resumeAutoplay() {
    if (this.settings.autoplay && !this.autoplayInterval && !this.isDestroyed) {
      this.setupAutoplay();
    }
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.resumeAutoplay();
        } else {
          this.pauseAutoplay();
        }
      });
    }, { threshold: 0.5 });

    this.observer.observe(this.element);
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
    this.pauseAutoplay();
    
    // Foco no primeiro item do menu para acessibilidade
    const firstMenuItem = this.floatingMenu.querySelector('.floating-category-menu__item');
    if (firstMenuItem) {
      setTimeout(() => firstMenuItem.focus(), 100);
    }

    // Adicionar atributos de acessibilidade
    this.menuToggle?.setAttribute('aria-expanded', 'true');
  }

  closeMenu() {
    if (!this.floatingMenu) return;

    this.floatingMenu.classList.remove('is-open');
    this.isMenuOpen = false;
    this.resumeAutoplay();
    
    // Remover atributos de acessibilidade
    this.menuToggle?.setAttribute('aria-expanded', 'false');
  }

  filterByCategory(collection, button) {
    if (this.isDestroyed) return;

    this.currentFilter = collection;
    this.element.classList.add('is-loading');
    
    // Atualizar botões ativos
    this.updateActiveButtons(button);

    // Filtrar produtos com animação
    this.animateProductFilter(collection);

    // Atualizar Flickity após animação
    setTimeout(() => {
      this.updateCarouselAfterFilter(button.textContent);
    }, this.products.length * 50 + 300);

    this.closeMenu();
  }

  showAllProducts() {
    if (this.isDestroyed) return;

    this.currentFilter = 'all';
    this.element.classList.add('is-loading');
    
    // Atualizar botões ativos
    this.updateActiveButtons(this.showAllButton);

    // Mostrar todos os produtos com animação
    this.animateShowAllProducts();

    // Atualizar Flickity após animação
    setTimeout(() => {
      this.updateCarouselAfterFilter('Todos os Produtos', this.products.length);
    }, this.products.length * 30 + 300);

    this.closeMenu();
  }

  updateActiveButtons(activeButton) {
    this.categoryButtons.forEach(btn => btn.classList.remove('is-active'));
    this.showAllButton?.classList.remove('is-active');
    activeButton?.classList.add('is-active');
  }

  animateProductFilter(collection) {
    let visibleCount = 0;
    
    this.products.forEach((product, index) => {
      const productCollection = product.dataset.collection;
      
      setTimeout(() => {
        if (productCollection === collection) {
          product.classList.remove('is-hidden');
          visibleCount++;
        } else {
          product.classList.add('is-hidden');
        }
      }, index * 50);
    });

    return visibleCount;
  }

  animateShowAllProducts() {
    this.products.forEach((product, index) => {
      setTimeout(() => {
        product.classList.remove('is-hidden');
      }, index * 30);
    });
  }

  updateCarouselAfterFilter(filterName, productCount) {
    if (this.flickity && !this.isDestroyed) {
      this.flickity.resize();
      this.flickity.select(0);
    }
    
    this.element.classList.remove('is-loading');
    
    // Contar produtos visíveis se não fornecido
    if (productCount === undefined) {
      productCount = Array.from(this.products).filter(p => !p.classList.contains('is-hidden')).length;
    }
    
    this.announceFilterChange(filterName, productCount);
  }

  announceFilterChange(filterName, productCount) {
    // Criar anúncio para leitores de tela
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'visually-hidden';
    announcement.textContent = `Filtro aplicado: ${filterName}. Mostrando ${productCount} produtos.`;
    
    document.body.appendChild(announcement);
    
    // Remover após anúncio
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }

  announceSlideChange(index) {
    if (!this.settings.announceSlides) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'visually-hidden';
    announcement.textContent = `Slide ${index + 1} de ${this.flickity.slides.length}`;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 500);
  }

  destroy() {
    this.isDestroyed = true;
    
    // Limpar Flickity
    if (this.flickity) {
      this.flickity.destroy();
      this.flickity = null;
    }
    
    // Limpar autoplay
    this.pauseAutoplay();
    
    // Limpar observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    // Remover event listeners
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
    document.removeEventListener('keydown', this.handleKeydown.bind(this));
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
}

// Gerenciador global de instâncias
window.ProductCarouselFloatingInstances = window.ProductCarouselFloatingInstances || new Map();

// Função de inicialização
function initProductCarouselFloating() {
  const carouselElements = document.querySelectorAll('[data-section-type="product-carousel-floating"]');
  
  carouselElements.forEach(element => {
    const sectionId = element.dataset.sectionId;
    
    // Destruir instância existente se houver
    if (window.ProductCarouselFloatingInstances.has(sectionId)) {
      window.ProductCarouselFloatingInstances.get(sectionId).destroy();
    }
    
    // Criar nova instância
    const instance = new ProductCarouselFloating(element);
    window.ProductCarouselFloatingInstances.set(sectionId, instance);
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
    }
  }
});

// Limpar instâncias quando seções forem descarregadas
document.addEventListener('shopify:section:unload', function(event) {
  if (event.detail.sectionId && window.ProductCarouselFloatingInstances.has(event.detail.sectionId)) {
    window.ProductCarouselFloatingInstances.get(event.detail.sectionId).destroy();
    window.ProductCarouselFloatingInstances.delete(event.detail.sectionId);
  }
});