# Chat WhatsApp Interativo

## Descrição

Widget de chat interativo para WhatsApp que replica a experiência da imagem fornecida. Inclui botão flutuante, interface de chat moderna, ações rápidas, horário de atendimento e integração completa com WhatsApp.

## Arquivos Criados

### 1. Seção Principal
- **`sections/whatsapp-chat-widget.liquid`** - Widget completo do chat

### 2. Arquivos de Estilo
- **`assets/whatsapp-chat-widget.css`** - Estilos CSS completos

### 3. Arquivos JavaScript
- **`assets/whatsapp-chat-widget.js`** - Funcionalidade interativa

## ✨ Funcionalidades

### 🎯 **Características Principais**

1. **Botão Flutuante**
   - Design moderno com gradiente WhatsApp
   - Animação de pulso contínua
   - Notificação com contador
   - Tooltip informativo

2. **Interface de Chat**
   - Header com avatar e status online/offline
   - Área de mensagens com scroll
   - Mensagem de boas-vindas automática
   - Efeito de digitação realista

3. **Ações Rápidas**
   - Botões personalizáveis (Rastrear, Calcular, Ajuda)
   - Ícones SVG integrados
   - Mensagens pré-definidas

4. **Funcionalidades Interativas**
   - Campo de texto com auto-resize
   - Envio por Enter ou botão
   - Respostas automáticas inteligentes
   - Redirecionamento para WhatsApp

5. **Horário de Atendimento**
   - Exibição completa da semana
   - Status online/offline automático
   - Nota personalizada

## 🚀 **Como Usar**

### 1. Adicionar o Widget

1. No editor de temas do Shopify
2. Vá para "Seções" → "Adicionar seção"
3. Procure por "Chat WhatsApp"
4. Adicione à página desejada

### 2. Configurações Básicas

#### **Informações do Negócio**
- **Nome do Negócio**: Nome exibido no header
- **Número do WhatsApp**: Formato internacional (5511999999999)
- **Avatar**: Imagem do atendente/empresa
- **Mensagem de Boas-vindas**: Primeira mensagem exibida

#### **Status e Notificações**
- **Status Online**: Indicador verde/cinza
- **Mostrar Notificação**: Badge com número
- **Número da Notificação**: Contador (1-99)
- **Tooltip**: Texto do balão informativo

### 3. Configurar Ações Rápidas

1. **Adicionar Bloco** → "Ação Rápida"
2. **Título**: Nome da ação (ex: "Rastrear")
3. **Subtítulo**: Descrição (ex: "Meu pedido")
4. **Ícone**: Escolher entre package, calculator, help
5. **Mensagem**: Texto que será enviado

### 4. Configurar Horário

1. **Adicionar Bloco** → "Horário"
2. **Dia**: Nome do dia da semana
3. **Horário**: Horário de funcionamento

## 🎨 **Personalização**

### **Cores e Estilos**
O widget usa as cores padrão do WhatsApp:
- **Verde Principal**: #25D366
- **Verde Escuro**: #128C7E
- **Roxo Header**: #7B68EE (personalizável)

### **Modificar Cores**
Edite o arquivo `assets/whatsapp-chat-widget.css`:

```css
/* Botão flutuante */
.whatsapp-widget__trigger {
  background: linear-gradient(135deg, #25D366, #128C7E);
}

/* Header do chat */
.whatsapp-widget__header {
  background: linear-gradient(135deg, #7B68EE, #9370DB);
}
```

## 🔧 **Funcionalidades Técnicas**

### **Respostas Automáticas**
O widget inclui respostas inteligentes baseadas em palavras-chave:

- **"preço"** → Informações sobre preços
- **"entrega"** → Prazos de entrega
- **"produto"** → Perguntas sobre produtos
- **"ajuda"** → Mensagem de suporte
- **"horário"** → Referência ao horário

### **Integração WhatsApp**
- Formata mensagens automaticamente
- Inclui histórico da conversa
- Abre em nova aba
- Funciona em mobile e desktop

### **Analytics**
Rastreia eventos automaticamente:
- `chat_opened` - Chat foi aberto
- `chat_closed` - Chat foi fechado
- `message_sent` - Mensagem enviada
- `whatsapp_redirect` - Redirecionamento para WhatsApp

## 📱 **Responsividade**

### **Mobile (≤480px)**
- Widget ocupa largura total menos margens
- Botão flutuante menor
- Tooltip oculto

### **Tablet (481px-1023px)**
- Layout intermediário
- Ações rápidas adaptadas

### **Desktop (≥1024px)**
- Layout completo
- Todas as funcionalidades visíveis

## ⚡ **Performance**

### **Otimizações**
- **CSS minificado** para carregamento rápido
- **Lazy loading** de funcionalidades
- **Event delegation** eficiente
- **Debounced resize** para textarea

### **Carregamento**
- Inicialização automática
- Suporte ao theme editor do Shopify
- Cleanup automático de recursos

## 🎯 **Casos de Uso**

### **E-commerce**
- Suporte ao cliente
- Rastreamento de pedidos
- Cálculo de frete
- Dúvidas sobre produtos

### **Serviços**
- Agendamentos
- Orçamentos
- Suporte técnico
- Informações gerais

### **Restaurantes**
- Pedidos delivery
- Reservas
- Cardápio
- Horário de funcionamento

## 🔒 **Segurança e Privacidade**

### **Dados do Usuário**
- Mensagens não são armazenadas no servidor
- Apenas redirecionamento para WhatsApp
- Sem coleta de dados pessoais

### **Analytics**
- Eventos anônimos
- Sem identificação pessoal
- Compatível com LGPD

## 🛠 **Troubleshooting**

### **Problemas Comuns**

1. **Widget não aparece**
   - Verifique se a seção foi adicionada
   - Confirme se os arquivos CSS/JS estão carregando

2. **WhatsApp não abre**
   - Verifique o formato do número (5511999999999)
   - Teste em diferentes dispositivos

3. **Mensagens não funcionam**
   - Verifique o console para erros JavaScript
   - Confirme se os event listeners estão ativos

### **Debug**
```javascript
// Verificar instância
console.log(document.querySelector('.whatsapp-widget').whatsappWidgetInstance);

// Abrir chat programaticamente
WhatsAppWidget.open('section-id');

// Enviar mensagem
WhatsAppWidget.sendMessage('section-id', 'Teste');
```

## 🎨 **Customizações Avançadas**

### **Adicionar Novos Ícones**
1. Edite o arquivo Liquid para adicionar novos casos no switch
2. Adicione o SVG correspondente
3. Atualize as opções no schema

### **Modificar Respostas Automáticas**
Edite o objeto `keywords` no JavaScript:

```javascript
const keywords = {
  'nova_palavra': 'Nova resposta automática',
  'outro_termo': 'Outra resposta personalizada'
};
```

### **Integração com CRM**
O widget pode ser integrado com sistemas de CRM através dos eventos de analytics.

## 📊 **Métricas e Analytics**

### **Eventos Rastreados**
- Taxa de abertura do chat
- Mensagens enviadas
- Redirecionamentos para WhatsApp
- Tempo de sessão

### **Google Analytics 4**
```javascript
gtag('event', 'chat_opened', {
  event_category: 'WhatsApp Widget'
});
```

### **Facebook Pixel**
```javascript
fbq('trackCustom', 'WhatsApp_chat_opened');
```

## 🚀 **Próximas Funcionalidades**

- [ ] Integração com chatbots
- [ ] Múltiplos atendentes
- [ ] Histórico de conversas
- [ ] Notificações push
- [ ] Integração com CRM
- [ ] Modo escuro automático
- [ ] Suporte a múltiplos idiomas

---

**Versão**: 1.0  
**Compatibilidade**: Shopify 2.0+  
**Navegadores**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+  
**Última atualização**: Janeiro 2026