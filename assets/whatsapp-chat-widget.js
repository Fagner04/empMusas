/**
 * WhatsApp Chat Widget
 * Widget interativo de atendimento via WhatsApp
 */

class WhatsAppChatWidget {
  constructor(element) {
    this.element = element;
    this.settings = JSON.parse(element.dataset.sectionSettings || '{}');
    this.sectionId = element.dataset.sectionId;
    
    this.trigger = element.querySelector('.whatsapp-widget__trigger');
    this.chat = element.querySelector('.whatsapp-widget__chat');
    this.closeBtn = element.querySelector('.whatsapp-widget__close');
    this.input = element.querySelector('.whatsapp-widget__input');
    this.sendBtn = element.querySelector('.whatsapp-widget__send');
    this.whatsappBtn = element.querySelector('.whatsapp-widget__whatsapp-button');
    this.messagesArea = element.querySelector('.whatsapp-widget__messages');
    this.quickActions = element.querySelectorAll('.whatsapp-widget__quick-action');
    
    this.isOpen = false;
    this.messages = [];
    this.currentMessage = '';
    
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.updateCurrentTime();
    this.setupAutoOpen();
    this.setupTypingEffect();
  }

  attachEventListeners() {
    // Toggle chat
    if (this.trigger) {
      this.trigger.addEventListener('click', () => this.toggleChat());
    }

    // Close chat
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeChat());
    }

    // Input handling
    if (this.input) {
      this.input.addEventListener('input', () => this.handleInput());
      this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    // Send message
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.sendMessage());
    }

    // WhatsApp redirect
    if (this.whatsappBtn) {
      this.whatsappBtn.addEventListener('click', () => this.redirectToWhatsApp());
    }

    // Quick actions
    this.quickActions.forEach(action => {
      action.addEventListener('click', () => {
        const message = action.dataset.message;
        if (message) {
          this.addQuickMessage(message);
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.element.contains(e.target)) {
        this.closeChat();
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeChat();
      }
    });
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.isOpen = true;
    this.chat.classList.add('is-open');
    
    // Hide notification
    const notification = this.element.querySelector('.whatsapp-widget__notification');
    if (notification) {
      notification.style.display = 'none';
    }

    // Focus input
    setTimeout(() => {
      if (this.input) {
        this.input.focus();
      }
    }, 300);

    // Analytics
    this.trackEvent('chat_opened');
  }

  closeChat() {
    this.isOpen = false;
    this.chat.classList.remove('is-open');
    
    // Analytics
    this.trackEvent('chat_closed');
  }

  handleInput() {
    this.currentMessage = this.input.value;
    this.autoResizeTextarea();
  }

  handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage() {
    const message = this.input.value.trim();
    if (!message) return;

    this.addMessage(message, 'sent');
    this.input.value = '';
    this.currentMessage = '';
    this.autoResizeTextarea();

    // Simulate typing response
    this.showTypingIndicator();
    
    setTimeout(() => {
      this.hideTypingIndicator();
      this.addAutoResponse(message);
    }, 1500);

    // Analytics
    this.trackEvent('message_sent', { message: message });
  }

  addMessage(text, type = 'received') {
    const messageElement = document.createElement('div');
    messageElement.className = `whatsapp-widget__message whatsapp-widget__message--${type}`;
    
    const currentTime = new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    messageElement.innerHTML = `
      <div class="whatsapp-widget__message-content">
        <div class="whatsapp-widget__message-text">${this.escapeHtml(text)}</div>
        <div class="whatsapp-widget__message-time">${currentTime}</div>
      </div>
    `;

    this.messagesArea.appendChild(messageElement);
    this.scrollToBottom();

    // Store message
    this.messages.push({ text, type, time: currentTime });
  }

  addQuickMessage(message) {
    this.input.value = message;
    this.currentMessage = message;
    this.autoResizeTextarea();
    this.input.focus();
  }

  addAutoResponse(userMessage) {
    const responses = [
      'Obrigado pela sua mensagem! Em breve entraremos em contato.',
      'Recebemos sua mensagem. Nossa equipe responderá em breve.',
      'Sua mensagem foi recebida. Aguarde nosso retorno.',
      'Obrigado pelo contato! Responderemos o mais rápido possível.'
    ];

    // Simple keyword-based responses
    const keywords = {
      'preço': 'Para informações sobre preços, clique no botão "Calcular Frete" ou fale diretamente conosco!',
      'entrega': 'Nossos prazos de entrega variam conforme sua região. Use nossa calculadora de frete!',
      'produto': 'Temos diversos produtos disponíveis. Que tipo de produto você está procurando?',
      'ajuda': 'Estamos aqui para ajudar! Como podemos te auxiliar hoje?',
      'horário': 'Nosso horário de atendimento está disponível abaixo. Fique à vontade para nos contatar!'
    };

    let response = responses[Math.floor(Math.random() * responses.length)];

    // Check for keywords
    const lowerMessage = userMessage.toLowerCase();
    for (const [keyword, keywordResponse] of Object.entries(keywords)) {
      if (lowerMessage.includes(keyword)) {
        response = keywordResponse;
        break;
      }
    }

    this.addMessage(response, 'received');
  }

  showTypingIndicator() {
    this.chat.classList.add('is-typing');
  }

  hideTypingIndicator() {
    this.chat.classList.remove('is-typing');
  }

  redirectToWhatsApp() {
    const number = this.settings.whatsappNumber || '';
    const businessName = this.settings.businessName || 'Loja';
    
    let message = `Olá ${businessName}! `;
    
    if (this.messages.length > 0) {
      message += 'Gostaria de continuar nossa conversa:\n\n';
      this.messages.forEach(msg => {
        if (msg.type === 'sent') {
          message += `${msg.text}\n`;
        }
      });
    } else if (this.currentMessage) {
      message += this.currentMessage;
    } else {
      message += 'Gostaria de mais informações sobre seus produtos.';
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${number}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Analytics
    this.trackEvent('whatsapp_redirect', { 
      number: number,
      message_count: this.messages.length 
    });
  }

  autoResizeTextarea() {
    if (!this.input) return;
    
    this.input.style.height = 'auto';
    this.input.style.height = Math.min(this.input.scrollHeight, 80) + 'px';
  }

  scrollToBottom() {
    if (this.messagesArea) {
      this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
    }
  }

  updateCurrentTime() {
    const timeElement = this.element.querySelector(`#current-time-${this.sectionId}`);
    if (timeElement) {
      const now = new Date();
      const timeString = now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      timeElement.textContent = timeString;
    }
  }

  setupAutoOpen() {
    if (this.settings.autoOpen && this.settings.autoOpenDelay) {
      setTimeout(() => {
        if (!this.isOpen) {
          this.openChat();
        }
      }, this.settings.autoOpenDelay);
    }
  }

  setupTypingEffect() {
    // Add typing effect to welcome message
    const welcomeMessage = this.element.querySelector('.whatsapp-widget__message--received');
    if (welcomeMessage) {
      const textElement = welcomeMessage.querySelector('.whatsapp-widget__message-text');
      if (textElement) {
        const originalText = textElement.textContent;
        textElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
          if (i < originalText.length) {
            textElement.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
          }
        };
        
        // Start typing effect when chat opens
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'class' && 
                this.chat.classList.contains('is-open')) {
              setTimeout(typeWriter, 500);
              observer.disconnect();
            }
          });
        });
        
        observer.observe(this.chat, { attributes: true });
      }
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  trackEvent(eventName, data = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'WhatsApp Widget',
        ...data
      });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', `WhatsApp_${eventName}`, data);
    }

    // Console log for debugging
    console.log('WhatsApp Widget Event:', eventName, data);
  }

  destroy() {
    // Remove event listeners and cleanup
    if (this.trigger) {
      this.trigger.removeEventListener('click', this.toggleChat);
    }
    
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleEscapeKey);
  }
}

// Auto-initialize widgets
function initWhatsAppWidgets() {
  const widgets = document.querySelectorAll('.whatsapp-widget');
  
  widgets.forEach(widget => {
    if (!widget.whatsappWidgetInstance) {
      widget.whatsappWidgetInstance = new WhatsAppChatWidget(widget);
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWhatsAppWidgets);
} else {
  initWhatsAppWidgets();
}

// Reinitialize for Shopify theme editor
document.addEventListener('shopify:section:load', function(event) {
  const widget = event.target.querySelector('.whatsapp-widget');
  if (widget) {
    widget.whatsappWidgetInstance = new WhatsAppChatWidget(widget);
  }
});

document.addEventListener('shopify:section:unload', function(event) {
  const widget = event.target.querySelector('.whatsapp-widget');
  if (widget && widget.whatsappWidgetInstance) {
    widget.whatsappWidgetInstance.destroy();
    widget.whatsappWidgetInstance = null;
  }
});

// Utility functions
window.WhatsAppWidget = {
  open: function(sectionId) {
    const widget = document.querySelector(`[data-section-id="${sectionId}"] .whatsapp-widget`);
    if (widget && widget.whatsappWidgetInstance) {
      widget.whatsappWidgetInstance.openChat();
    }
  },
  
  close: function(sectionId) {
    const widget = document.querySelector(`[data-section-id="${sectionId}"] .whatsapp-widget`);
    if (widget && widget.whatsappWidgetInstance) {
      widget.whatsappWidgetInstance.closeChat();
    }
  },
  
  sendMessage: function(sectionId, message) {
    const widget = document.querySelector(`[data-section-id="${sectionId}"] .whatsapp-widget`);
    if (widget && widget.whatsappWidgetInstance) {
      widget.whatsappWidgetInstance.addQuickMessage(message);
    }
  }
};