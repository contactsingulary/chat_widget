(function() {
  // Styles
  const styles = `
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
    @import url('https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css');

    :root {
      --widget-button-color: #0070f3;
      --widget-icon-color: #f2f2f2;
      --widget-button-hover-color: #3593ff;
    }

    .widget-buttons {
      position: fixed;
      bottom: 20px;
      right: 78px;
      display: flex;
      flex-direction: row-reverse;
      gap: 10px;
      z-index: 998;
      transition: transform 0.5s ease, opacity 0.5s ease;
    }

    .widget-button {
      background-color: var(--widget-button-color);
      color: var(--widget-icon-color);
      border: none;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.5s ease, opacity 0.5s ease;
      position: relative;
    }

    .widget-button i {
      pointer-events: none;
    }

    .widget-button:hover {
      background-color: var(--widget-button-hover-color);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .widget-buttons.collapsed {
      transform: translateX(70px);
      opacity: 0;
    }

    .widget-buttons.collapsed .widget-button {
      transform: scale(0);
    }

    .button-stack-area {
      position: fixed;
      bottom: 0;
      right: 0;
      width: 300px;
      height: 200px;
      z-index: 997;
    }

    df-messenger {
      --df-messenger-bot-message: var(--widget-button-color);
      --df-messenger-button-titlebar-color: var(--widget-button-color);
      --df-messenger-chat-background-color: #fafafa;
      --df-messenger-font-color: #000000;
      --df-messenger-send-icon: var(--widget-button-color);
      --df-messenger-user-message: #5a0f0f;
      --df-messenger-fab-color: var(--widget-button-color);
      --df-messenger-fab-icon-color: var(--widget-icon-color);
      --df-messenger-chat-bubble-size: 48px;
      --df-messenger-chat-bubble-background: var(--widget-button-color);
      --df-messenger-chat-bubble-icon-color: var(--widget-icon-color);
      --df-messenger-chat-bubble-border-radius: 50%;
      z-index: 1000;
      transition: all 0.3s ease;
    }

    df-messenger {
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 1000;
    }

    df-messenger::part(chat-bubble) {
      width: 56px !important;
      height: 56px !important;
      background-color: var(--widget-button-color) !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
    }

    df-messenger::part(chat-bubble):hover {
      background-color: var(--widget-button-hover-color) !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
    }

    df-messenger {
      --df-messenger-primary-color: var(--widget-button-color);
      --df-messenger-titlebar-background: #ffffff;
      --df-messenger-font-color: #333333;
      --df-messenger-message-bot-background: #f2f2f2;
      --df-messenger-message-user-background: var(--widget-button-color);
      --df-messenger-message-user-font-color: var(--widget-icon-color);
      --df-messenger-chat-background: #ffffff;
      --df-messenger-input-background: #ffffff;
      --df-messenger-send-icon-color: var(--widget-button-color);
      --df-messenger-chat-scroll-button-background: var(--widget-button-color);
      --df-messenger-chat-scroll-button-font-color: var(--widget-icon-color);
      --df-messenger-input-box-focus-border: 2px solid var(--widget-button-color);
      --df-messenger-chat-window-height: 650px;
      --df-messenger-chat-window-width: 400px;
      --df-messenger-chat-border-radius: 2px;
    }

    df-messenger::part(input-wrapper:focus-within) {
      border-color: var(--widget-button-color) !important;
    }

    .chat-popup-container {
      position: fixed;
      bottom: 82px;
      right: 20px;
      display: flex;
      flex-direction: column-reverse;
      align-items: flex-end;
      gap: 0px;
      z-index: 999;
    }

    .chat-popup {
      position: relative;
      background-color: #f2f2f2;
      color: #333333;
      padding: 12px 20px;
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 999;
      font-size: 13px;
      max-width: 400px;
      width: max-content;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.3;
      cursor: pointer;
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      transform: translateY(10px);
      margin-bottom: -26px;
    }

    .chat-popup:first-child {
      margin-bottom: 0;
    }

    .chat-popup::after {
      content: '';
      position: absolute;
      bottom: -8px;
      right: 20px;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid #f2f2f2;
      transition: border-top-color 0.3s ease;
    }

    .chat-popup:hover {
      background-color: #e0e0e0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .chat-popup:hover::after {
      border-top-color: #e0e0e0;
    }

    .chat-popup.show {
      opacity: 1;
      transform: translateY(0);
    }

    .chat-popup.hide {
      opacity: 0;
      transform: translateY(10px);
    }

    .social-icons {
      display: flex;
      justify-content: space-around;
      margin-top: 5px;
    }

    .social-icons a {
      color: var(--widget-button-color);
      font-size: 18px;
      transition: color 0.3s ease, filter 0.3s ease;
    }

    .social-icons a:hover {
      color: var(--widget-button-hover-color);
      filter: brightness(1.5);
    }

    .grecaptcha-badge {
      visibility: hidden;
    }

    .recaptcha-text {
      font-size: 12px;
      color: #666;
      text-align: center;
      margin-top: 10px;
    }

    .recaptcha-text a {
      color: var(--widget-button-color);
      text-decoration: none;
    }

    .recaptcha-text a:hover {
      text-decoration: underline;
    }
  `;

  // Create style element
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);

  // Create and append elements
  const chatPopupContainer = document.createElement('div');
  chatPopupContainer.id = 'chatPopupContainer';
  chatPopupContainer.className = 'chat-popup-container';
  document.body.appendChild(chatPopupContainer);

  const widgetButtons = document.createElement('div');
  widgetButtons.className = 'widget-buttons';
  widgetButtons.innerHTML = `
    <button class="widget-button" id="searchWidgetTrigger">
      <i class="fas fa-search"></i>
    </button>
    <button class="widget-button" onclick="window.location.href='tel:+491234567890';">
      <i class="fas fa-phone"></i>
    </button>
    <button class="widget-button" onclick="window.location.href='mailto:info@goost-immobilien.de';">
      <i class="fas fa-envelope"></i>
    </button>
  `;
  document.body.appendChild(widgetButtons);

  const buttonStackArea = document.createElement('div');
  buttonStackArea.className = 'button-stack-area';
  document.body.appendChild(buttonStackArea);

  const dfMessenger = document.createElement('df-messenger');
  dfMessenger.setAttribute('intent', 'WELCOME');
  dfMessenger.setAttribute('chat-title', 'GoostGPT');
  dfMessenger.setAttribute('agent-id', '0a296a3b-f2ab-49f9-b07d-aae7f98e6618');
  dfMessenger.setAttribute('language-code', 'de');
  document.body.appendChild(dfMessenger);

  const recaptchaText = document.createElement('div');
  recaptchaText.className = 'recaptcha-text';
  recaptchaText.innerHTML = `
    This site is protected by reCAPTCHA and the Google
    <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and
    <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.
  `;
  document.body.appendChild(recaptchaText);

  // Script logic
  let lastScrollTop = 0;
  let buttonsCollapsed = false;
  let collapseTimeout;
  let shownPopups = new Set();
  let maxScrollReached = 0;
  let pageLoadTime = Date.now();
  let firstTwoBubblesShown = false;

  function showChatPopup(message, duration, socialIcons = false) {
    if (shownPopups.has(message)) return;
    shownPopups.add(message);

    const popup = document.createElement('div');
    popup.className = 'chat-popup';
    popup.innerHTML = message;

    if (socialIcons) {
      popup.innerHTML += `
        <div class="social-icons">
          <a href="https://www.instagram.com/goost_immobilien/" target="_blank"><i class="fab fa-instagram"></i></a>
          <a href="https://www.facebook.com/Goost.Immobilien/" target="_blank"><i class="fab fa-facebook"></i></a>
          <a href="https://www.youtube.com/channel/UCnLEXs3sZmUv6zQYIPko6UQ" target="_blank"><i class="fab fa-youtube"></i></a>
          <a href="https://www.linkedin.com/company/goost-immobilien/" target="_blank"><i class="fab fa-linkedin"></i></a>
        </div>
      `;
    }

    chatPopupContainer.insertBefore(popup, chatPopupContainer.firstChild);

    const existingPopups = chatPopupContainer.querySelectorAll('.chat-popup');
    existingPopups.forEach((existingPopup, index) => {
      if (index > 0) {
        existingPopup.style.transform = `translateY(-${index * 100}%)`;
      }
    });

    setTimeout(() => {
      popup.classList.add('show');
    }, 100);

    setTimeout(() => {
      popup.classList.remove('show');
      popup.classList.add('hide');
      setTimeout(() => {
        chatPopupContainer.removeChild(popup);
        const remainingPopups = chatPopupContainer.querySelectorAll('.chat-popup');
        remainingPopups.forEach((remainingPopup, index) => {
          remainingPopup.style.transform = `translateY(-${index * 100}%)`;
        });
      }, 300);
    }, duration);

    if (shownPopups.size === 2) {
      firstTwoBubblesShown = true;
      checkForFourthBubble();
    }
  }

  function checkForFourthBubble() {
    if (firstTwoBubblesShown && Date.now() - pageLoadTime > 30000 && !shownPopups.has('Kann ich Ihnen zu einer speziellen Frage behilflich sein?')) {
      showChatPopup('Kann ich Ihnen zu einer speziellen Frage behilflich sein?', 5000);
    }
  }

  function initializeSearchButton() {
    const searchButton = document.getElementById('searchWidgetTrigger');
    if (searchButton) {
      searchButton.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        const searchWidget = document.querySelector('gen-search-widget');
        if (searchWidget) {
          searchWidget.setAttribute('open', '');
        }
      });
    }
  }

  function initializeChatPopupListeners() {
    chatPopupContainer.addEventListener('click', function(event) {
      const popup = event.target.closest('.chat-popup');
      if (popup) {
        if (event.target.closest('.social-icons a')) {
          return;
        }
        const dfMessenger = document.querySelector('df-messenger');
        if (dfMessenger) {
          dfMessenger.setAttribute('expand', 'true');
        }
      }
    });
  }

  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    initializeSearchButton();
    initializeChatPopupListeners();
    showChatPopup('👋 Willkommen! Wie kann ich Ihnen helfen?', 5000);
  });

  // Wait for the window to fully load
  window.addEventListener('load', function() {
    initializeSearchButton();
    
    // Create and append the search widget
    const searchWidget = document.createElement('gen-search-widget');
    searchWidget.setAttribute('configId', '7059425d-0df0-429c-846a-86f698dc4fde');
    searchWidget.setAttribute('triggerId', 'searchWidgetTrigger');
    document.body.appendChild(searchWidget);
  });

  window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollPercentage = (scrollTop / scrollHeight) * 100;

    maxScrollReached = Math.max(maxScrollReached, scrollTop);

    if (scrollTop > lastScrollTop && !buttonsCollapsed) {
      collapseButtons();
    } else if (scrollTop < lastScrollTop && buttonsCollapsed) {
      expandButtons();
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

    if (maxScrollReached > 1300 && !shownPopups.has('🔎 Haben Sie gefunden was Sie suchen?')) {
      showChatPopup('🔎 Haben Sie gefunden was Sie suchen?', 5000);
    }

    if (scrollPercentage > 90 && !shownPopups.has('Besuchen Sie uns gerne auf Social Media!')) {
      showChatPopup('Besuchen Sie uns gerne auf Social Media!', 7000, true);
    }

    checkForFourthBubble();
  });

  setInterval(checkForFourthBubble, 1000);

  buttonStackArea.addEventListener('mouseenter', expandButtons);

  document.addEventListener('mousemove', function(e) {
    const chatbot = document.querySelector('df-messenger');
    if (chatbot) {
      const chatbotRect = chatbot.getBoundingClientRect();
      const buttonStackRect = buttonStackArea.getBoundingClientRect();
      const isNearButtons = e.clientX > buttonStackRect.left && e.clientX < chatbotRect.right &&
                            e.clientY > buttonStackRect.top && e.clientY < chatbotRect.bottom;

      if (isNearButtons) {
        clearTimeout(collapseTimeout);
        expandButtons();
      } else if (!buttonsCollapsed && lastScrollTop > 0) {
        clearTimeout(collapseTimeout);
        collapseTimeout = setTimeout(collapseButtons, 1000);
      }
    }
  });

  function collapseButtons() {
    widgetButtons.classList.add('collapsed');
    buttonsCollapsed = true;
  }

  function expandButtons() {
    widgetButtons.classList.remove('collapsed');
    buttonsCollapsed = false;
  }

  // Load external resources
  const fontAwesomeLink = document.createElement('link');
  fontAwesomeLink.rel = 'stylesheet';
  fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
  document.head.appendChild(fontAwesomeLink);

  const dfMessengerStyleLink = document.createElement('link');
  dfMessengerStyleLink.rel = 'stylesheet';
  dfMessengerStyleLink.href = 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css';
  document.head.appendChild(dfMessengerStyleLink);

  const dfMessengerScript = document.createElement('script');
  dfMessengerScript.src = 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js';
  document.body.appendChild(dfMessengerScript);

  // Load Gen App Builder script
  const genAppBuilderScript = document.createElement('script');
  genAppBuilderScript.src = 'https://cloud.google.com/ai/gen-app-builder/client?hl=en_US';
  document.body.appendChild(genAppBuilderScript);
})();
