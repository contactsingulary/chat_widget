// Load external CSS and JavaScript resources
function loadExternalResource(type, url) {
  return new Promise((resolve, reject) => {
    let element;
    if (type === 'css') {
      element = document.createElement('link');
      element.rel = 'stylesheet';
      element.href = url;
    } else if (type === 'js') {
      element = document.createElement('script');
      element.src = url;
    }

    element.onload = resolve;
    element.onerror = reject;
    document.head.appendChild(element);
  });
}

Promise.all([
  loadExternalResource('css', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'),
  loadExternalResource('css', 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css'),
  loadExternalResource('js', 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js'),
  loadExternalResource('js', 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'),
  loadExternalResource('js', 'https://cloud.google.com/ai/gen-app-builder/client?hl=en_US')
]).then(() => {
  // Inject CSS styling
  const style = document.createElement('style');
  style.innerHTML = `
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

    df-messenger {
      --df-messenger-bot-message: var(--widget-button-color);
      --df-messenger-button-titlebar-color: var(--widget-button-color);
      --df-messenger-chat-background-color: #fafafa;
      --df-messenger-font-color: #000000;
      --df-messenger-send-icon: var(--widget-button-color);
      --df-messenger-user-message: #5a0f0f;
      --df-messenger-fab-color: var(--widget-button-color);
      --df-messenger-fab-icon-color: var(--widget-icon-color);
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

    .chat-popup.show {
      opacity: 1;
      transform: translateY(0);
    }

    .chat-popup.hide {
      opacity: 0;
      transform: translateY(10px);
    }
  `;
  document.head.appendChild(style);

  // Inject HTML structure
  const widgetContainer = document.createElement('div');
  widgetContainer.innerHTML = `
    <!-- Container für Chat-Popups -->
    <div class="chat-popup-container" id="chatPopupContainer"></div>

    <!-- Widget Buttons -->
    <div class="widget-buttons">
      <button class="widget-button" id="searchWidgetTrigger">
        <i class="fas fa-search"></i>
      </button>
      <button class="widget-button" onclick="window.location.href='tel:+491234567890';">
        <i class="fas fa-phone"></i>
      </button>
      <button class="widget-button" onclick="window.location.href='mailto:info@goost-immobilien.de';">
        <i class="fas fa-envelope"></i>
      </button>
    </div>

    <!-- Dialogflow Messenger -->
    <df-messenger
      intent="WELCOME"
      chat-title="GoostGPT"
      agent-id="0a296a3b-f2ab-49f9-b07d-aae7f98e6618"
      language-code="de">
    </df-messenger>

    <!-- reCAPTCHA text -->
    <div class="recaptcha-text">
      This site is protected by reCAPTCHA and the Google
      <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and
      <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.
    </div>
  `;
  document.body.appendChild(widgetContainer);

  // Full JS functionality including popups and button behavior
  let lastScrollTop = 0;
  const widgetButtons = document.querySelector('.widget-buttons');
  const chatPopupContainer = document.getElementById('chatPopupContainer');
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

    setTimeout(() => popup.classList.add('show'), 100);
    setTimeout(() => {
      popup.classList.remove('show');
      popup.classList.add('hide');
      setTimeout(() => chatPopupContainer.removeChild(popup), 300);
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

  document.addEventListener('DOMContentLoaded', function() {
    const dfMessenger = document.querySelector('df-messenger');
    const searchButton = document.getElementById('searchWidgetTrigger');

    function openChatbot(event) {
      event.preventDefault();
      event.stopPropagation();
      dfMessenger.setAttribute('expand', 'true');
    }

    function triggerSearch(event) {
      event.preventDefault();
      event.stopPropagation();
      const searchWidget = document.querySelector('gen-search-widget');
      if (searchWidget) {
        searchWidget.setAttribute('open', 'true');
      }
    }

    if (searchButton) {
      searchButton.addEventListener('click', triggerSearch);
    }

    chatPopupContainer.addEventListener('click', function(event) {
      const popup = event.target.closest('.chat-popup');
      if (popup) {
        if (event.target.closest('.social-icons a')) {
          return;
        }
        openChatbot(event);
      }
    });

    showChatPopup('👋 Willkommen! Wie kann ich Ihnen helfen?', 5000);
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

    if (maxScrollReached > 1300 && !shownPopups.has('🔎 Haben Sie noch offene Fragen?')) {
      showChatPopup('🔎 Haben Sie noch offene Fragen?', 5000);
    }

    if (scrollPercentage > 90 && !shownPopups.has('Besuchen Sie uns gerne auf Social Media!')) {
      showChatPopup('Besuchen Sie uns gerne auf Social Media!', 7000, true);
    }

    checkForFourthBubble();
  });

  setInterval(checkForFourthBubble, 1000);

  function collapseButtons() {
    widgetButtons.classList.add('collapsed');
    buttonsCollapsed = true;
  }

  function expandButtons() {
    widgetButtons.classList.remove('collapsed');
    buttonsCollapsed = false;
  }

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
}).catch(error => {
  console.error("Error loading external resources:", error);
});
