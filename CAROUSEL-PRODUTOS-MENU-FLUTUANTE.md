# Carousel de Produtos com Menu Flutuante

## Descrição

Esta funcionalidade adiciona um carousel de produtos avançado com um menu flutuante para filtrar produtos por categoria. É uma solução moderna e interativa para exibir produtos de diferentes coleções em uma única seção.

## Arquivos Criados

### 1. Seção Principal
- **`sections/product-carousel-floating.liquid`** - Seção principal do carousel

### 2. Arquivos de Estilo
- **`assets/product-carousel-floating.css`** - Estilos CSS avançados
- **`snippets/floating-menu-icon.liquid`** - Ícones personalizados para o menu

### 3. Arquivos JavaScript
- **`assets/product-carousel-floating.js`** - Funcionalidade JavaScript completa

## Funcionalidades

### ✨ Características Principais

1. **Menu Flutuante**
   - Botão flutuante no canto superior direito
   - Dropdown com categorias configuráveis
   - Animações suaves de abertura/fechamento
   - Design moderno com gradientes e sombras

2. **Carousel de Produtos**
   - Baseado no Flickity (já usado no tema)
   - Navegação por setas
   - Scroll suave e responsivo
   - Suporte a touch/swipe em dispositivos móveis

3. **Filtros por Categoria**
   - Filtragem dinâmica por coleção
   - Animações escalonadas ao filtrar
   - Opção "Todos os Produtos"
   - Transições suaves entre filtros

4. **Recursos Avançados**
   - Autoplay configurável
   - Pausa automática no hover
   - Intersection Observer para performance
   - Suporte completo a acessibilidade
   - Anúncios para leitores de tela

## Como Usar

### 1. Adicionar a Seção

1. Acesse o editor de temas do Shopify
2. Vá para a página onde deseja adicionar o carousel
3. Clique em "Adicionar seção"
4. Procure por "Carousel de Produtos com Menu"
5. Adicione a seção

### 2. Configurar a Seção

#### Configurações Gerais
- **Título**: Título principal da seção
- **Subtítulo**: Texto descritivo opcional
- **Mostrar menu flutuante**: Ativar/desativar o menu
- **Produtos por categoria**: Quantos produtos mostrar de cada coleção (4-20)
- **Mostrar compra rápida**: Botão de compra rápida nos produtos
- **Mostrar imagem secundária**: Imagem hover nos produtos
- **Reprodução automática**: Ativar autoplay do carousel
- **Velocidade da reprodução**: Tempo entre slides (2-10 segundos)

#### Adicionar Categorias
1. Clique em "Adicionar bloco" → "Categoria"
2. Selecione a **Coleção** desejada
3. Defina um **Título personalizado** (opcional)
4. Repita para adicionar mais categorias

### 3. Personalização

#### Cores e Estilos
O carousel usa as variáveis CSS do tema:
- `--primary-button-background`
- `--accent-color`
- `--secondary-background`
- `--text-color`
- `--border-radius-theme`

#### Modificar Estilos
Edite o arquivo `assets/product-carousel-floating.css` para personalizar:
- Cores do menu flutuante
- Animações e transições
- Tamanhos e espaçamentos
- Responsividade

## Estrutura Técnica

### HTML Structure
```html
<section class="product-carousel-floating">
  <div class="floating-category-menu">
    <!-- Menu flutuante -->
  </div>
  <div class="product-carousel-floating__carousel">
    <!-- Produtos do carousel -->
  </div>
</section>
```

### CSS Classes Principais
- `.product-carousel-floating` - Container principal
- `.floating-category-menu` - Menu flutuante
- `.floating-category-menu.is-open` - Menu aberto
- `.floating-category-menu__item.is-active` - Item ativo
- `.product-carousel-floating__item.is-hidden` - Produto oculto

### JavaScript API
```javascript
// Acessar instância
const instance = window.ProductCarouselFloatingInstances.get('section-id');

// Métodos disponíveis
instance.filterByCategory('collection-handle', buttonElement);
instance.showAllProducts();
instance.toggleMenu();
instance.destroy();
```

## Responsividade

### Breakpoints
- **Mobile** (≤640px): Layout compacto, menu menor
- **Tablet** (641px-1023px): Layout intermediário
- **Desktop** (≥1024px): Layout completo
- **Wide** (≥1280px): Produtos maiores

### Adaptações Mobile
- Menu flutuante menor
- Produtos com largura reduzida
- Touch/swipe otimizado
- Scroll horizontal nativo como fallback

## Acessibilidade

### Recursos Implementados
- **ARIA labels** e **roles** apropriados
- **Navegação por teclado** completa
- **Anúncios para leitores de tela**
- **Focus management** adequado
- **Contraste** e **tamanhos** acessíveis
- **Reduced motion** support

### Atalhos de Teclado
- **ESC**: Fechar menu flutuante
- **Tab**: Navegar entre elementos
- **Enter/Space**: Ativar botões
- **Setas**: Navegar no carousel (quando focado)

## Performance

### Otimizações
- **Intersection Observer** para autoplay inteligente
- **Debounced resize** handlers
- **Lazy loading** de imagens (via tema)
- **CSS transforms** para animações suaves
- **Event delegation** para melhor performance

### Carregamento
- CSS e JS carregados apenas quando necessário
- Inicialização lazy dos componentes
- Cleanup automático de event listeners

## Compatibilidade

### Navegadores Suportados
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Android Chrome 60+

### Dependências
- **Flickity** (já incluído no tema)
- **CSS Custom Properties** support
- **ES6 Classes** support
- **Intersection Observer** (com fallback)

## Troubleshooting

### Problemas Comuns

1. **Carousel não aparece**
   - Verifique se há produtos nas coleções selecionadas
   - Confirme se o Flickity está carregado

2. **Menu não abre**
   - Verifique se JavaScript está habilitado
   - Confirme se não há conflitos de CSS z-index

3. **Filtros não funcionam**
   - Verifique se as coleções estão configuradas corretamente
   - Confirme se os produtos têm as coleções associadas

4. **Autoplay não funciona**
   - Verifique se a opção está habilitada nas configurações
   - Confirme se não há erros JavaScript no console

### Debug
```javascript
// Verificar instâncias ativas
console.log(window.ProductCarouselFloatingInstances);

// Verificar configurações
const element = document.querySelector('[data-section-type="product-carousel-floating"]');
console.log(JSON.parse(element.dataset.sectionSettings));
```

## Customização Avançada

### Adicionar Novos Filtros
1. Modifique o schema da seção para novos tipos de bloco
2. Atualize o JavaScript para lidar com novos filtros
3. Adicione estilos CSS correspondentes

### Integração com Apps
O carousel é compatível com apps de:
- Reviews de produtos
- Wishlist/Favoritos
- Quick view/Visualização rápida
- Comparação de produtos

### Eventos Customizados
```javascript
// Escutar mudanças de filtro
document.addEventListener('carousel:filter-changed', (e) => {
  console.log('Filtro alterado:', e.detail);
});

// Escutar mudanças de slide
document.addEventListener('carousel:slide-changed', (e) => {
  console.log('Slide alterado:', e.detail);
});
```

## Suporte

Para dúvidas ou problemas:
1. Verifique este documento primeiro
2. Consulte o console do navegador para erros
3. Teste em diferentes dispositivos e navegadores
4. Verifique se todas as dependências estão carregadas

---

**Versão**: 1.0  
**Compatibilidade**: Shopify 2.0+  
**Última atualização**: Janeiro 2026