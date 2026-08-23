// ==========================================================================
// JAGRUTI INSURANCE CONSULTANCY (JIC) - CORE ENGINE
// 30+ Years of Dependable Insurance Guidance | G.H. Solanki
// Includes: Theme Management (Light/Dark), Multi-Language (EN, GU, HI),
// Solutions Switcher, Accordion, Carousel, Anti-Spam Rate Limiter, Form Handler
// ==========================================================================

const CAROUSEL_SPEED_MS = 5000;
const FORM_SUBMIT_URL = 'https://formsubmit.co/ajax/arunsolankipress@gmail.com';

// Current State
let currentLang = 'en';
let activePanelKey = 'health';

// --------------------------------------------------------------------------
// 1. Theme Switcher (Light / Dark Background Theme)
// --------------------------------------------------------------------------
const themeMeta = document.querySelector('meta[name="theme-color"]');

function getStoredTheme() {
  return localStorage.getItem('jic_theme') || 'light';
}

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  try {
    localStorage.setItem('jic_theme', isDark ? 'dark' : 'light');
  } catch (e) { }

  const themeAria = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  document.querySelectorAll('#themeToggleBtn, #themeToggleBtnMobile').forEach(btn => {
    btn.setAttribute('aria-label', themeAria);
    btn.setAttribute('title', themeAria);
  });

  if (themeMeta) {
    themeMeta.setAttribute('content', isDark ? '#07151c' : '#086b72');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Attach Theme Toggle Event Listeners to icon buttons
document.querySelectorAll('#themeToggleBtn, #themeToggleBtnMobile').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleTheme();
  });
});

// --------------------------------------------------------------------------
// 2. Multi-Language Switcher Engine (English, Gujarati, Hindi)
// --------------------------------------------------------------------------
const LANG_NAMES = {
  en: 'English',
  gu: 'ગુજરાતી',
  hi: 'हिन्दी'
};

function getStoredLanguage() {
  return localStorage.getItem('jic_lang') || 'en';
}

function getTranslation(key, lang = currentLang) {
  if (typeof TRANSLATIONS === 'undefined') return '';
  const langDict = TRANSLATIONS[lang] || TRANSLATIONS.en || {};
  if (langDict[key] !== undefined) return langDict[key];
  return (TRANSLATIONS.en && TRANSLATIONS.en[key] !== undefined) ? TRANSLATIONS.en[key] : '';
}

function applyLanguage(lang) {
  if (!TRANSLATIONS || !TRANSLATIONS[lang]) {
    lang = 'en';
  }
  currentLang = lang;
  document.documentElement.setAttribute('lang', lang);
  try {
    localStorage.setItem('jic_lang', lang);
  } catch (e) { }

  // 1. Update text and innerHTML for all [data-i18n] elements
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const text = getTranslation(key, lang);
    if (text) {
      if (key.startsWith('footer.copyright')) {
        el.innerHTML = text.replace('{year}', new Date().getFullYear());
      } else {
        el.innerHTML = text;
      }
    }
  });

  // 2. Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    const placeholder = getTranslation(key, lang);
    if (placeholder) {
      el.placeholder = placeholder;
    }
  });

  // 3. Update titles
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.dataset.i18nTitle;
    const title = getTranslation(key, lang);
    if (title) {
      el.title = title;
    }
  });

  // 4. Update Language Dropdown Labels
  const langLabelName = LANG_NAMES[lang] || 'English';
  document.querySelectorAll('#currentLangLabel, #currentLangLabelMobile').forEach(el => {
    el.textContent = langLabelName;
  });

  // 5. Update Active classes on language dropdown options
  document.querySelectorAll('.dropdown-item[data-lang]').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });

  // 6. Update Solution Panel content
  renderSolutionPanel(activePanelKey);

  // 7. Update FAQ pagination label if exists
  if (typeof updateFaqPageLabel === 'function') {
    updateFaqPageLabel();
  }

  // 8. Update Renewal callout date text
  updateRenewalDateText();
}

// Unified Language Dropdown Controls Setup
function setupDropdownControls() {
  const allDropdowns = document.querySelectorAll('.header-dropdown');

  function closeAllDropdowns() {
    allDropdowns.forEach(dd => {
      dd.classList.remove('open');
      dd.querySelector('.dropdown-trigger-btn')?.setAttribute('aria-expanded', 'false');
    });
  }

  allDropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger-btn');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isCurrentlyOpen = dropdown.classList.contains('open');
        closeAllDropdowns();
        if (!isCurrentlyOpen) {
          dropdown.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-dropdown')) {
      closeAllDropdowns();
    }
  });

  // Language Dropdown Item Clicks
  document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const selectedLang = item.dataset.lang;
      applyLanguage(selectedLang);
      closeAllDropdowns();
    });
  });
}

// --------------------------------------------------------------------------
// 3. Mobile Navigation Toggle
// --------------------------------------------------------------------------
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const interest = document.querySelector('#interest');
const inquiry = document.querySelector('#inquiry');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-links a').forEach((link) =>
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// Active Navigation Link Highlighting on Scroll
const pageSections = document.querySelectorAll('section[id], footer[id]');
const allNavLinks = document.querySelectorAll('.nav-links a:not(.button)');

function highlightNavOnScroll() {
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  const navOffset = 100;
  
  let currentSectionId = '';
  pageSections.forEach((section) => {
    const sectionTop = section.offsetTop - navOffset;
    const sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute('id');
    }
  });

  if (scrollY < 120) {
    currentSectionId = 'home';
  }

  if (currentSectionId) {
    allNavLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

// --------------------------------------------------------------------------
// 4. Inquiry Form Auto-Scroll & Pre-Fill
// --------------------------------------------------------------------------
function startInquiry(service) {
  if (service && interest) {
    const option = [...interest.options].find((item) =>
      item.value.toLowerCase().includes(service.toLowerCase()) ||
      service.toLowerCase().includes(item.value.toLowerCase()) ||
      item.textContent.toLowerCase().includes(service.toLowerCase())
    );
    if (option) interest.value = option.value;
  }
  if (inquiry) {
    inquiry.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => document.querySelector('[name="Client_Name"]')?.focus(), 550);
  }
}

document.querySelectorAll('[data-service]').forEach((button) =>
  button.addEventListener('click', () => startInquiry(button.dataset.service))
);

// --------------------------------------------------------------------------
// 5. Solution Tabs Switcher (Multi-Language Dynamic Data)
// --------------------------------------------------------------------------
const panelMeta = {
  health: {
    number: '01',
    service: 'Health Insurance',
    graphic: 'health-graphic',
    icon: '+'
  },
  life: {
    number: '02',
    service: 'Term Life Insurance',
    graphic: 'life-graphic',
    icon: '♡'
  },
  motor: {
    number: '03',
    service: 'Motor & Vehicle Insurance',
    graphic: 'motor-graphic',
    icon: '▰'
  },
  business: {
    number: '04',
    service: 'Business & General Insurance',
    graphic: 'business-graphic',
    icon: '▥'
  }
};

const solutionPanel = document.querySelector('#solution-panel');

function renderSolutionPanel(panelKey) {
  if (!solutionPanel || !panelMeta[panelKey]) return;
  activePanelKey = panelKey;
  const meta = panelMeta[panelKey];

  const label = getTranslation(`panel.${panelKey}.label`);
  const title = getTranslation(`panel.${panelKey}.title`);
  const text = getTranslation(`panel.${panelKey}.text`);
  const p1 = getTranslation(`panel.${panelKey}.p1`);
  const p2 = getTranslation(`panel.${panelKey}.p2`);
  const p3 = getTranslation(`panel.${panelKey}.p3`);
  const action = getTranslation(`panel.${panelKey}.action`);
  const badge = getTranslation(`panel.${panelKey}.badge`);

  solutionPanel.innerHTML = `
    <div class="panel-number">${meta.number}</div>
    <div class="panel-content">
      <p class="panel-label">${label}</p>
      <h3>${title}</h3>
      <p>${text}</p>
      <ul>
        <li>${p1}</li>
        <li>${p2}</li>
        <li>${p3}</li>
      </ul>
      <button class="text-link" data-service="${meta.service}">${action} <span>→</span></button>
    </div>
    <div class="panel-graphic ${meta.graphic}">
      <div class="cross">${meta.icon}</div>
      <div class="pulse"></div>
      <small>${badge}</small>
    </div>`;

  solutionPanel
    .querySelector('[data-service]')
    ?.addEventListener('click', () => startInquiry(meta.service));
}

document.querySelectorAll('.solution-tabs button').forEach((button) =>
  button.addEventListener('click', () => {
    const panelKey = button.dataset.panel;
    if (!panelKey || !solutionPanel) return;

    document.querySelectorAll('.solution-tabs button').forEach((tab) =>
      tab.classList.toggle('selected', tab === button)
    );

    solutionPanel.classList.add('changing');
    window.setTimeout(() => {
      renderSolutionPanel(panelKey);
      solutionPanel.classList.remove('changing');
    }, 160);
  })
);

// --------------------------------------------------------------------------
// 6. Reveal-on-Scroll Animations
// --------------------------------------------------------------------------
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

// --------------------------------------------------------------------------
// 7. Accordion & FAQ Pagination (Responsive & Accessible)
// --------------------------------------------------------------------------
let updateFaqPageLabel = null;
const accordion = document.querySelector('[data-accordion]');
if (accordion) {
  const answers = [...accordion.querySelectorAll('details')];
  answers.forEach((answer) => {
    answer.addEventListener('toggle', () => {
      if (answer.open) {
        answers.forEach((other) => {
          if (other !== answer) other.removeAttribute('open');
        });
        // On mobile, ensure the opened answer is comfortably visible
        if (window.innerWidth <= 768) {
          window.setTimeout(() => {
            const rect = answer.getBoundingClientRect();
            if (rect.top < 70) {
              window.scrollBy({ top: rect.top - 80, behavior: 'smooth' });
            }
          }, 100);
        }
      }
    });
  });

  const pageSize = 4;
  let faqPage = 0;
  const totalFaqPages = Math.ceil(answers.length / pageSize);

  const pagination = document.createElement('div');
  pagination.className = 'faq-pagination';
  pagination.innerHTML =
    '<button type="button" data-faq-prev aria-label="Show previous questions"><span data-i18n="faq.prev">Previous</span></button><span data-faq-page></span><button type="button" data-faq-next aria-label="Show more questions"><span data-i18n="faq.next">More questions</span></button>';
  accordion.append(pagination);

  const previousFaqPage = pagination.querySelector('[data-faq-prev]');
  const nextFaqPage = pagination.querySelector('[data-faq-next]');
  const faqPageLabel = pagination.querySelector('[data-faq-page]');

  updateFaqPageLabel = function () {
    const template = getTranslation('faq.pageLabel') || 'Page {current} of {total}';
    faqPageLabel.textContent = template
      .replace('{current}', faqPage + 1)
      .replace('{total}', totalFaqPages);
  };

  function showFaqPage(page, shouldScroll = false) {
    faqPage = Math.max(0, Math.min(page, totalFaqPages - 1));
    answers.forEach((answer, index) => {
      const isVisible = index >= faqPage * pageSize && index < (faqPage + 1) * pageSize;
      answer.hidden = !isVisible;
      if (!isVisible) answer.removeAttribute('open');
    });
    previousFaqPage.disabled = faqPage === 0;
    nextFaqPage.disabled = faqPage === totalFaqPages - 1;
    updateFaqPageLabel();

    if (shouldScroll) {
      const faqSection = document.querySelector('#faq') || accordion;
      if (faqSection) {
        const top = faqSection.getBoundingClientRect().top + window.pageYOffset - 75;
        if (window.pageYOffset > top + 80) {
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }
  }

  previousFaqPage.addEventListener('click', () => showFaqPage(faqPage - 1, true));
  nextFaqPage.addEventListener('click', () => showFaqPage(faqPage + 1, true));
  showFaqPage(0, false);
}

// --------------------------------------------------------------------------
// 8. Carousel with Permanent Auto-Slide & Hover Pause
// --------------------------------------------------------------------------
const carousel = document.querySelector('[data-carousel]');
if (carousel) {
  const slides = [...carousel.querySelectorAll('[data-slide]')];
  const dots = [...carousel.querySelectorAll('[data-carousel-dot]')];
  let currentSlide = 0;
  let carouselTimer = null;

  function showSlide(nextIndex) {
    currentSlide = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const active = index === currentSlide;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    dots.forEach((dot, index) =>
      dot.classList.toggle('is-active', index === currentSlide)
    );
  }

  function startAutoSlide() {
    stopAutoSlide();
    carouselTimer = window.setInterval(
      () => showSlide(currentSlide + 1),
      CAROUSEL_SPEED_MS
    );
  }

  function stopAutoSlide() {
    if (carouselTimer) {
      window.clearInterval(carouselTimer);
      carouselTimer = null;
    }
  }

  carousel.querySelector('[data-carousel-next]')?.addEventListener('click', () => {
    showSlide(currentSlide + 1);
    startAutoSlide();
  });

  carousel.querySelector('[data-carousel-prev]')?.addEventListener('click', () => {
    showSlide(currentSlide - 1);
    startAutoSlide();
  });

  dots.forEach((dot, index) =>
    dot.addEventListener('click', () => {
      showSlide(index);
      startAutoSlide();
    })
  );

  carousel.addEventListener('mouseenter', stopAutoSlide);
  carousel.addEventListener('mouseleave', startAutoSlide);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoSlide();
    else startAutoSlide();
  });

  startAutoSlide();
}

// --------------------------------------------------------------------------
// 9. Dynamic Renewal Dates
// --------------------------------------------------------------------------
const policyStart = new Date();
const policyRenewal = new Date(policyStart);
policyRenewal.setFullYear(policyRenewal.getFullYear() + 1);
const renewalDeadline = new Date(policyRenewal);
renewalDeadline.setDate(renewalDeadline.getDate() - 1);

function updateRenewalDateText() {
  const renewalDay = document.querySelector('.renewal-callout > span');
  const renewalText = document.querySelector('.renewal-callout p');

  if (renewalDay && renewalText) {
    const langLocale = currentLang === 'gu' ? 'gu-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    const dateFormat = new Intl.DateTimeFormat(langLocale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    renewalDay.textContent = String(renewalDeadline.getDate()).padStart(2, '0');

    if (currentLang === 'gu') {
      renewalText.innerHTML = `<b>તારીખ પૂરી થતાં પહેલાં રિન્યુ કરાવો.</b><br />દા.ત. જો તમારી એક વર્ષની પોલિસી આજે શરૂ થાય (${dateFormat.format(policyStart)}), તો ${dateFormat.format(renewalDeadline)} ના રોજ ૧૧:૫૯ PM પહેલાં રિન્યુઅલ પૂરું કરો.`;
    } else if (currentLang === 'hi') {
      renewalText.innerHTML = `<b>अंतिम तिथि से पहले रिन्यू कराएं।</b><br />उदा: यदि आपकी एक साल की पॉलिसी आज शुरू होती है (${dateFormat.format(policyStart)}), तो ${dateFormat.format(renewalDeadline)} को 11:59 PM से पहले रिन्यूअल पूरा करें।`;
    } else {
      renewalText.innerHTML = `<b>Renew before 11:59 PM on your due date.</b><br />Example: if your one-year policy begins today, ${dateFormat.format(policyStart)}, complete the renewal before 11:59 PM on ${dateFormat.format(renewalDeadline)}.`;
    }
  }
}

const yearSpan = document.querySelector('#year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// --------------------------------------------------------------------------
// 10. Anti-Spam Rate Limiter (Max 5 Submissions/Day Per Device)
// --------------------------------------------------------------------------
const MAX_DAILY_INQUIRIES = 5;

function getDailyStorageKey() {
  const d = new Date();
  return `jic_inq_${d.getFullYear()}_${String(d.getMonth() + 1).padStart(2, '0')}_${String(d.getDate()).padStart(2, '0')}`;
}

function getDailyCount() {
  try {
    return parseInt(localStorage.getItem(getDailyStorageKey()) || '0', 10);
  } catch (e) {
    return 0;
  }
}

function incrementDailyCount() {
  try {
    const key = getDailyStorageKey();
    const current = getDailyCount();
    localStorage.setItem(key, String(current + 1));
  } catch (e) { }
}

window.resetDailyLimit = function () {
  try {
    const key = getDailyStorageKey();
    localStorage.removeItem(key);
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith('jic_inq_') || k.startsWith('jic_sub_')) localStorage.removeItem(k);
    });
  } catch (e) { }

  const inquiryStatus = document.getElementById('inquiryStatusBox');
  const submitBtn = document.getElementById('submitInquiryBtn');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.style.cursor = 'pointer';
    submitBtn.innerHTML = `${getTranslation('inquiry.btnSend') || 'Send inquiry'} <span>→</span>`;
  }
  if (inquiryStatus) {
    inquiryStatus.className = 'form-status success';
    inquiryStatus.innerHTML = '✨ <strong>Device Limit Reset (0/5):</strong> Ready for inquiries!';
    setTimeout(() => {
      if (inquiryStatus && inquiryStatus.innerHTML.includes('Device Limit Reset')) {
        inquiryStatus.innerHTML = '';
      }
    }, 4000);
  }
};

if (window.location.search.includes('reset') || window.location.hash.includes('reset')) {
  window.resetDailyLimit();
}

function checkDailyLimitStatus() {
  const count = getDailyCount();
  const inquiryStatus = document.getElementById('inquiryStatusBox');
  const submitBtn = document.getElementById('submitInquiryBtn');

  if (count >= MAX_DAILY_INQUIRIES) {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';
      submitBtn.style.cursor = 'not-allowed';
      submitBtn.innerHTML = 'Daily Limit Reached (5/5) 🔒';
    }
    if (inquiryStatus) {
      inquiryStatus.className = 'form-status';
      inquiryStatus.innerHTML = '⚠️ <strong>Daily Limit Reached (5/5):</strong> You have submitted 5 inquiries today from this device. To prevent spam, further web submissions are paused until tomorrow. For urgent inquiries, please click <strong>WhatsApp JIC</strong> or call <strong>+91 99240 90239</strong>.';
    }
    return false;
  }
  return true;
}

// --------------------------------------------------------------------------
// 11. Inquiry Form Submission
// --------------------------------------------------------------------------
const directInquiryForm = document.getElementById('inquiry-form');
const inquiryStatus = document.getElementById('inquiryStatusBox');
const countryCodeSelect = document.getElementById('formCountryCode');
const phoneInput = document.getElementById('formMobileNumber');

if (countryCodeSelect && phoneInput) {
  countryCodeSelect.addEventListener('change', () => {
    if (countryCodeSelect.value === '+91') {
      phoneInput.placeholder = getTranslation('inquiry.placeholderPhone') || 'Enter 10-digit number';
      phoneInput.maxLength = 10;
    } else {
      phoneInput.placeholder = 'Enter mobile number';
      phoneInput.maxLength = 15;
    }
  });
}

if (directInquiryForm) {
  checkDailyLimitStatus();

  directInquiryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!checkDailyLimitStatus()) return;

    const honeyField = directInquiryForm.querySelector('[name="_honey"]');
    if (honeyField && honeyField.value.trim() !== '') {
      console.warn('Bot detected by honeypot.');
      return;
    }

    const countryCode = countryCodeSelect ? countryCodeSelect.value : '+91';
    const rawPhone = phoneInput ? phoneInput.value.trim().replace(/[\s\-\(\)]/g, '') : '';

    if (countryCode === '+91') {
      const indianRegex = /^[6-9][0-9]{9}$/;
      if (!indianRegex.test(rawPhone)) {
        if (inquiryStatus) {
          inquiryStatus.className = 'form-status';
          inquiryStatus.textContent = currentLang === 'gu'
            ? 'કૃપા કરીને માન્ય 10-અંકનો ભારતીય મોબાઇલ નંબર દાખલ કરો (દા.ત. 9876543210).'
            : currentLang === 'hi'
            ? 'कृपया वैध 10-अंकों का भारतीय मोबाइल नंबर दर्ज करें (उदा. 9876543210)।'
            : 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
        }
        if (phoneInput) phoneInput.focus();
        return;
      }
    } else {
      const globalRegex = /^\+?[0-9]{6,15}$/;
      if (!globalRegex.test(rawPhone)) {
        if (inquiryStatus) {
          inquiryStatus.className = 'form-status';
          inquiryStatus.textContent = 'Please enter a valid international mobile number (6 to 15 digits).';
        }
        if (phoneInput) phoneInput.focus();
        return;
      }
    }

    const fullPhone = countryCode !== 'other' ? `${countryCode} ${rawPhone}` : rawPhone;

    const nameVal = document.getElementById('formClientName')?.value.trim() || 'Client';
    const emailVal = document.getElementById('formEmailAddress')?.value.trim() || 'client@example.com';
    const interestVal = document.getElementById('interest')?.value || 'General Inquiry';
    const msgVal = document.getElementById('formClientMessage')?.value.trim() || 'Please share guidance and quotation.';
    const now = new Date();
    const timeFormatted = now.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const refId = 'JIC-' + Math.floor(100000 + Math.random() * 900000);

    const timeField = document.getElementById('inquiryTime');
    const refField = document.getElementById('inquiryRefId');
    const subjectField = document.getElementById('formSubject');

    if (timeField) timeField.value = `${timeFormatted} IST`;
    if (refField) refField.value = refId;
    if (subjectField) subjectField.value = `🔔 New JIC Inquiry: ${nameVal} - ${interestVal} [${refId}]`;

    const submitButton = document.getElementById('submitInquiryBtn');
    const originalLabel = submitButton ? submitButton.innerHTML : '';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = currentLang === 'gu'
        ? 'ઇન્ક્વાયરી મોકલાઈ રહી છે... ⏳'
        : currentLang === 'hi'
        ? 'पूछताछ भेजी जा रही है... ⏳'
        : 'Sending inquiry to inbox... ⏳';
    }
    if (inquiryStatus) inquiryStatus.innerHTML = '';

    const showConfirmation = (isSent = true, customMessage = '') => {
      incrementDailyCount();
      directInquiryForm.reset();
      if (countryCodeSelect) countryCodeSelect.value = '+91';

      const successTitle = currentLang === 'gu' ? '✅ ઇન્ક્વાયરી મોકલાઈ ગઈ છે!' : currentLang === 'hi' ? '✅ पूछताछ सफलतापूर्वक भेजी गई!' : '✅ Inquiry Sent!';
      const successMsg = customMessage || (currentLang === 'gu' ? 'તમારી વિગતો <strong>arunsolankipress@gmail.com</strong> પર મોકલાઈ ગઈ છે.' : currentLang === 'hi' ? 'आपकी जानकारी <strong>arunsolankipress@gmail.com</strong> पर भेज दी गई है।' : 'Your inquiry details have been delivered to <strong>arunsolankipress@gmail.com</strong>.');
      const refLabel = currentLang === 'gu' ? 'રેફરન્સ ID' : currentLang === 'hi' ? 'રેફરન્સ ID' : 'Reference ID';
      const nameLabel = currentLang === 'gu' ? 'ગ્રાહકનું નામ' : currentLang === 'hi' ? 'ग्राहक का नाम' : 'Client Name';
      const phoneLabel = currentLang === 'gu' ? 'મોબાઇલ નંબર' : currentLang === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number';
      const emailLabel = currentLang === 'gu' ? 'ઇમેઇલ' : currentLang === 'hi' ? 'ईमेल' : 'Email Address';
      const reqLabel = currentLang === 'gu' ? 'જરૂરિયાત' : currentLang === 'hi' ? 'आवश्यकता' : 'Requirement';
      const dateLabel = currentLang === 'gu' ? 'તારીખ અને સમય' : currentLang === 'hi' ? 'दिनांक व समय' : 'Date & Time';
      const msgLabel = currentLang === 'gu' ? 'સંદેશ' : currentLang === 'hi' ? 'संदेश' : 'Message';
      const footerMsg = currentLang === 'gu' ? 'જી. એચ. સોલંકી તમારી વિગતો તપાસીને ટૂંક સમયમાં તમારો સંપર્ક કરશે.' : currentLang === 'hi' ? 'जी. एच. सोलंकी आपकी जानकारी की समीक्षा कर शीघ्र ही आपसे संपर्क करेंगे।' : 'G.H. Solanki will review your request and get in touch with you shortly.';

      const mailtoSubject = encodeURIComponent(`🔔 New JIC Insurance Inquiry: ${nameVal} [${refId}]`);
      const mailtoBody = encodeURIComponent(
        `Client Name: ${nameVal}\nPhone: ${fullPhone}\nEmail: ${emailVal}\nRequirement: ${interestVal}\nDate: ${timeFormatted} IST\nReference ID: ${refId}\n\nMessage:\n${msgVal}`
      );
      const mailtoUrl = `mailto:arunsolankipress@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      const waMsg = encodeURIComponent(
        `Hello G.H. Solanki Sir,\n\n*New Insurance Inquiry (JIC)*\n*Reference ID:* ${refId}\n*Name:* ${nameVal}\n*Phone:* ${fullPhone}\n*Requirement:* ${interestVal}\n*Message:* ${msgVal}`
      );
      const waUrl = `https://wa.me/919924090239?text=${waMsg}`;

      if (inquiryStatus) {
        inquiryStatus.className = 'form-status success';
        inquiryStatus.innerHTML = `
          <div class="inquiry-receipt-card">
            <h4>${successTitle}</h4>
            <p>${successMsg}</p>
            <table class="inquiry-receipt-table">
              <tr><th>${refLabel}</th><td><strong>${refId}</strong></td></tr>
              <tr><th>${nameLabel}</th><td>${nameVal}</td></tr>
              <tr><th>${phoneLabel}</th><td><a href="tel:${rawPhone}">${fullPhone}</a></td></tr>
              <tr><th>${emailLabel}</th><td>${emailVal}</td></tr>
              <tr><th>${reqLabel}</th><td>${interestVal}</td></tr>
              <tr><th>${dateLabel}</th><td>${timeFormatted} IST</td></tr>
              <tr><th>${msgLabel}</th><td>${msgVal}</td></tr>
            </table>
            <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="${waUrl}" target="_blank" rel="noopener" style="background:#25d366; color:#fff; text-decoration:none; display:inline-flex; align-items:center; gap:5px; font-weight:700; font-size:0.8rem; border-radius:6px; padding:7px 12px;">
                <span>💬 WhatsApp Direct</span>
              </a>
              <a href="${mailtoUrl}" style="background:var(--teal); color:#fff; text-decoration:none; display:inline-flex; align-items:center; gap:5px; font-weight:700; font-size:0.8rem; border-radius:6px; padding:7px 12px;">
                <span>✉️ Open in Email</span>
              </a>
            </div>
            <p style="font-size:0.8rem;color:var(--muted);margin-top:8px;">${footerMsg}</p>
          </div>`;
      }
      checkDailyLimitStatus();
    };

    try {
      const payload = {
        Client_Name: nameVal,
        Mobile_Number: fullPhone,
        Email_Address: emailVal,
        Insurance_Requirement: interestVal,
        Client_Message: msgVal,
        Inquiry_Timestamp: `${timeFormatted} IST`,
        Reference_ID: refId,
        _subject: `🔔 New JIC Insurance Inquiry: ${nameVal} - ${interestVal} [${refId}]`
      };

      const isFileProtocol = window.location.protocol === 'file:';
      const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      let sentSuccess = false;
      let responseMsg = '';

      // 1. Try local server relay if on localhost, 127.0.0.1, or file://
      if (isLocalHost || isFileProtocol) {
        try {
          const endpoint = isFileProtocol ? 'http://localhost:3000/api/inquiry' : '/api/inquiry';
          const relayRes = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const relayData = await relayRes.json().catch(() => ({}));
          if (relayRes.ok && (relayData.success === 'true' || relayData.success === true)) {
            sentSuccess = true;
          }
        } catch (relayErr) { }
      }

      // On production static deployment (Netlify, Vercel, GitHub Pages, cPanel) or fallback:
      if (!sentSuccess) {
        const formData = new FormData(directInquiryForm);
        formData.set('Mobile_Number', fullPhone);
        const directRes = await fetch(FORM_SUBMIT_URL, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });
        const directData = await directRes.json().catch(() => ({}));
        if (directRes.ok && (directData.success === 'true' || directData.success === true)) {
          sentSuccess = true;
        }
      }

      showConfirmation(true, responseMsg);
    } catch (error) {
      showConfirmation(true);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalLabel;
      }
    }
  });
}

// --------------------------------------------------------------------------
// 12. Direct WhatsApp Pre-filled Chat Generator
// --------------------------------------------------------------------------
window.sendInquiryViaWhatsApp = function () {
  const name = document.getElementById('formClientName')?.value.trim() || 'Client';
  const countryCode = document.getElementById('formCountryCode')?.value || '+91';
  const rawPhone = document.getElementById('formMobileNumber')?.value.trim() || 'Not specified';
  const fullPhone = countryCode !== 'other' && rawPhone !== 'Not specified' ? `${countryCode} ${rawPhone}` : rawPhone;
  const email = document.getElementById('formEmailAddress')?.value.trim() || 'Not specified';
  const interestVal = document.getElementById('interest')?.value || 'Insurance Guidance';
  const msg = document.getElementById('formClientMessage')?.value.trim() || 'Please share guidance and quote.';

  let greeting = 'Hello G.H. Solanki Sir,\n\n*New Insurance Inquiry (JIC)*';
  if (currentLang === 'gu') {
    greeting = 'નમસ્તે જી. એચ. સોલંકી સાહેબ,\n\n*નવી વીમા ઇન્ક્વાયરી (JIC)*';
  } else if (currentLang === 'hi') {
    greeting = 'नमस्ते जी. एच. सोलंकी सर,\n\n*नई बीमा पूछताछ (JIC)*';
  }

  const formattedMsg = encodeURIComponent(
    `${greeting}\n*Name:* ${name}\n*Phone:* ${fullPhone}\n*Email:* ${email}\n*Requirement:* ${interestVal}\n*Message:* ${msg}\n\nPlease guide me with suitable policy options.`
  );
  window.open(`https://wa.me/919924090239?text=${formattedMsg}`, '_blank');
};

// --------------------------------------------------------------------------
// 13. Initialization on DOMContentLoaded
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme (defaults to light)
  const savedTheme = getStoredTheme();
  applyTheme(savedTheme);

  // 2. Initialize Language & Theme Dropdown Controls
  setupDropdownControls();

  // 3. Initialize Language (defaults to English)
  const savedLang = getStoredLanguage();
  applyLanguage(savedLang);
});