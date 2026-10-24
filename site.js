(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-nav');
  const closeMenu = () => {
    if (!menu || !navigation) return;
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };
  if (menu && navigation) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      navigation.classList.toggle('is-open', open);
    });
    navigation.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menu.focus();
      }
    });
    window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);
  }
  document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });

  const tablist = document.querySelector('.sample-tabs');
  if (tablist) {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const activateTab = (tab, focus = false) => {
      tabs.forEach(item => {
        const active = item === tab;
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
        document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activateTab(tab));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); activateTab(tabs[next], true); }
      });
    });
  }

  const form = document.querySelector('#inquiry-form');
  if (!form) return;
  const service = document.querySelector('#service');
  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      service.value = link.dataset.service;
      document.querySelector('#inquiry-result').hidden = true;
    });
  });
  const result = document.querySelector('#inquiry-result');
  const status = document.querySelector('#inquiry-status');
  const preview = document.querySelector('#inquiry-preview');
  const draftLink = document.querySelector('#email-draft-link');
  const copy = document.querySelector('#copy-inquiry');
  const recipient = 'Sales@PrimeReliabilityGroup.com';
  let currentInquiry = '';
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const company = String(data.get('company') || '').trim();
    const email = String(data.get('email') || '').trim();
    const interest = String(data.get('service') || 'Not sure yet');
    const message = String(data.get('message') || '').trim();
    const subject = `Project inquiry: ${interest}${company ? ` — ${company}` : ''}`;
    const body = `Hello Prime Reliability Group,\n\nI'd like to discuss the following project.\n\nName: ${name}\nCompany: ${company || 'Not provided'}\nEmail: ${email}\nService: ${interest}\n\nEquipment or concern:\n${message}\n\nThank you,\n${name}`;
    currentInquiry = `To: ${recipient}\nSubject: ${subject}\n\n${body}`;
    preview.textContent = currentInquiry;
    draftLink.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    result.hidden = false;
    status.textContent = 'Your inquiry is ready. Open the email draft to review and send it.';
    copy.textContent = 'Copy inquiry';
    result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  });
  form.addEventListener('input', () => { result.hidden = true; });
  form.addEventListener('change', () => { result.hidden = true; });
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(currentInquiry);
      copy.textContent = 'Copied';
      status.textContent = 'Inquiry copied. Paste it into an email to Sales@PrimeReliabilityGroup.com and send when ready.';
    } catch {
      document.querySelector('.draft-details').open = true;
      const range = document.createRange();
      range.selectNodeContents(preview);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'The inquiry text is selected below. Copy it and send it from your email app.';
    }
  });
})();
