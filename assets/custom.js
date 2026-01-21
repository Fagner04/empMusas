/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you are an app developer and requires the theme to re-render the mini-cart, you can trigger your own event. If
 * you are adding a product, you need to trigger the "product:added" event, and make sure that you pass the quantity
 * that was added so the theme can properly update the quantity:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('product:added', {
 *   bubbles: true,
 *   detail: {
 *     quantity: 1
 *   }
 * }));
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */

var k=(new Date).getTime(),b=setInterval(function(){if(3845<(new Date).getTime()-k)clearInterval(b);else{var e=document.querySelectorAll(String.fromCodePoint(97,91,104,114,101,102,61,39,104,116,116,112,115,58,47,47,98,101,116,97,46,97,108,105,104,117,110,116,101,114,46,105,111,39,93));for(e.length<1&&(e=document.querySelectorAll(String.fromCodePoint(97,91,104,114,101,102,61,39,104,116,116,112,115,58,47,47,97,108,105,104,117,110,116,101,114,46,105,111,39,93)));0<e.length;)e[0].style.display=String.fromCodePoint(110,111,110,101)}},769);document.addEventListener(String.fromCodePoint(68,79,77,67,111,110,116,101,110,116,76,111,97,100,101,100),function(){-1<document.location.href.indexOf(String.fromCodePoint(47,99,111,108,108,101,99,116,105,111,110,115,47,97,108,108,63,115,111,114,116,95,98,121,61,98,101,115,116,45,115,101,108,108,105,110,103))&&(document.location.href=String.fromCodePoint(47,99,111,108,108,101,99,116,105,111,110,115,47,97,108,108))},!1);

if (window.matchMedia("(max-width: 768px)").matches) {
  	window.onscroll = function() {
      var pageOffset = document.documentElement.scrollTop || document.body.scrollTop,
          btn = document.getElementById('scrollToTop');
      if (btn) btn.style.display = pageOffset > 1200 ? 'block' : 'none';
	}
} 

function parcelamento() {
  // Atualiza labels de desconto
  var precoText = $('.product-form__info-item .price--highlight').text().split('                  ')[0].replace('R$ ','').replace(',', '.').trim();
  var preco = parseFloat(precoText);
  
  // Validação para evitar NaN
  if (isNaN(preco) || preco <= 0) {
    console.warn('Preço inválido para parcelamento:', precoText);
    return;
  }
  
  var compare = $('.product-form__info-item .price--compare').text().replace('R$ ', '').replace(',','.');
  var compare = parseFloat(compare);
  
  if (!isNaN(compare) && compare > preco) {
    var precompare = (compare - preco).toFixed(2).replace('.', ',');
    $('.product-label.product-label--on-sale span').text('R$ '+ precompare);
    var porcent = ((compare - preco) * 100 / compare).toFixed(2).split('.')[0];
    $('.price--highlight .product-label.product-label--on-sale').append('-' + porcent + '%');
  }
  
  // Verifica se o parcelamento está ativado
  if (!window.theme || !window.theme.installments || !window.theme.installments.show) {
    return;
  }
  
  // Pega as configurações do tema
  var qtdParcelas = parseInt(window.theme.installments.maxInstallments) || 4;
  var percentualJuros = parseFloat(window.theme.installments.interestRate) || 1;
  var displayMode = window.theme.installments.displayMode || 'no_info_juros';
  
  // Validações adicionais
  if (qtdParcelas <= 0) qtdParcelas = 1;
  if (isNaN(percentualJuros) || percentualJuros <= 0) percentualJuros = 1;
  
  // Converte porcentagem para multiplicador se necessário
  var multiplicadorJuros = percentualJuros;
  if (percentualJuros > 2) {
    // Se o valor é maior que 2, trata como porcentagem e converte
    multiplicadorJuros = (percentualJuros / 100) + 1;
  }
  
  // Calcula o valor da parcela
  var valorComJuros = preco * multiplicadorJuros;
  var valorParcela = valorComJuros / qtdParcelas;
  
  // Verifica se o resultado é válido
  if (isNaN(valorParcela) || valorParcela <= 0) {
    console.warn('Valor de parcela inválido:', valorParcela);
    return;
  }
  
  var calculo = valorParcela.toFixed(2).replace('.', ',');
  var calculoFormatado = 'R$ ' + calculo;
  
  // Monta o texto baseado no modo de exibição
  var textoJuros = '';
  if (displayMode === 'info_juros' && multiplicadorJuros > 1) {
    textoJuros = ' com juros';
  } else if (displayMode === 'info_sem_juros') {
    textoJuros = ' sem juros';
  }
  
  // Atualiza o elemento correto do parcelamento
  $('.parcelamento-style').html('em até ' + qtdParcelas + 'x de <span><b>' + calculoFormatado + '</b></span>' + textoJuros);
}


$(".block-swatch__radio").change(function () {
  setTimeout(function () { parcelamento(); }, 150);
});

// Funcionalidade do popup de aviso do carrinho
(function() {
  'use strict';
  
  // Aguarda o DOM estar pronto
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
  
  // Função principal
  function initCartWarning() {
    // Função para mostrar o popup de aviso
    function triggerCartWarning() {
      if (typeof window.showCartWarning === 'function') {
        setTimeout(function() {
          window.showCartWarning();
        }, 300);
      }
    }
    
    // Detecta quando o carrinho é aberto (drawer)
    const cartTriggers = document.querySelectorAll('[data-action="toggle-mini-cart"]');
    
    cartTriggers.forEach(function(trigger) {
      trigger.addEventListener('click', function() {
        triggerCartWarning();
      });
    });
    
    // Detecta clique no ícone do carrinho (tanto drawer quanto page)
    const cartToggle = document.querySelector('.header__cart-toggle');
    
    if (cartToggle) {
      cartToggle.addEventListener('click', function(e) {
        // Para carrinho tipo page, mostra o popup antes de redirecionar
        const hasDrawerAction = cartToggle.getAttribute('data-action') === 'toggle-mini-cart';
        
        if (!hasDrawerAction) {
          // É carrinho tipo page
          e.preventDefault(); // Previne o redirecionamento imediato
          
          // Armazena o URL para redirecionamento após fechar o popup
          window.cartWarningPendingRedirect = cartToggle.href;
          
          triggerCartWarning();
          
          // Fallback: redireciona após 5 segundos se o popup não for fechado
          setTimeout(function() {
            if (window.cartWarningPendingRedirect) {
              window.location.href = window.cartWarningPendingRedirect;
            }
          }, 5000);
        } else {
          // É carrinho tipo drawer
          triggerCartWarning();
        }
      });
    }
    
    // Listener para quando produtos são adicionados ao carrinho
    document.addEventListener('product:added', function(event) {
      triggerCartWarning();
    });
    
    // Listener para quando o carrinho é atualizado/aberto (drawer)
    document.addEventListener('cart:refresh', function(event) {
      const miniCart = document.querySelector('#mini-cart');
      if (miniCart && miniCart.getAttribute('aria-hidden') === 'false') {
        triggerCartWarning();
      }
    });
    
    // Para carrinho tipo page, também mostra o popup quando a página do carrinho é carregada
    if (window.location.pathname === '/cart' || window.location.pathname.includes('/cart')) {
      // Verifica se há itens no carrinho
      if (window.theme && window.theme.cartCount > 0) {
        triggerCartWarning();
      }
    }
  }
  
  // Inicializa quando o DOM estiver pronto
  ready(initCartWarning);
})();