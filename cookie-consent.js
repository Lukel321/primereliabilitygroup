(() => {
  'use strict';

  const COOKIE_NAME = 'prg_cookie_preferences';
  const VERSION = 1;
  // No ad provider is connected. This preference must not authorize a future provider.
  const SCOPE = 'unconfigured';
  const MAX_AGE = 180 * 24 * 60 * 60;

  const readPreference = () => {
    try {
      const encoded = document.cookie.split('; ').find(item => item.startsWith(`${COOKIE_NAME}=`));
      if (!encoded) return null;
      const value = JSON.parse(decodeURIComponent(encoded.slice(COOKIE_NAME.length + 1)));
      if (value.version !== VERSION || value.scope !== SCOPE || typeof value.advertising !== 'boolean' ||
          !Number.isFinite(value.expires) || value.expires <= Date.now() ||
          value.expires > Date.now() + MAX_AGE * 1000 + 60000) return null;
      return value;
    } catch {
      return null;
    }
  };

  let preference = readPreference();
  let returnFocus = null;

  const banner = document.createElement('section');
  banner.id = 'cookie-banner';
  banner.className = 'cookie-banner';
  banner.setAttribute('aria-label', 'Cookie choices');
  banner.hidden = Boolean(preference);
  banner.innerHTML = `<div class="cookie-banner-inner"><div class="cookie-banner-copy"><h2>Your cookie choices.</h2><p>We save your choice in an essential cookie. Advertising cookies stay off until you opt in. No advertising service is connected yet. <a href="privacy.html#cookie-choices">Read our cookie information</a>.</p></div><div class="cookie-actions"><button class="cookie-button" type="button" data-cookie-choice="accept">Accept advertising</button><button class="cookie-button" type="button" data-cookie-choice="reject">Reject advertising</button><button class="cookie-settings-link" type="button" data-cookie-settings>Manage choices</button></div></div>`;

  const dialog = document.createElement('dialog');
  dialog.id = 'cookie-dialog';
  dialog.className = 'cookie-dialog';
  dialog.setAttribute('aria-labelledby', 'cookie-dialog-title');
  dialog.innerHTML = `<button class="cookie-dialog-close" type="button" aria-label="Close cookie settings">Close <span aria-hidden="true">×</span></button><h2 id="cookie-dialog-title" tabindex="-1">Cookie settings.</h2><p>Choose whether to allow optional advertising cookies. No advertising platform is connected, so saving a preference does not start tracking. We will ask again when a platform is added.</p><form id="cookie-preferences"><div class="cookie-essential"><strong>Essential preference cookie</strong><p>Always used after you make a choice. Remembers these settings for up to 180 days, without a visitor ID.</p></div><label class="cookie-option"><input id="cookie-advertising" type="checkbox" name="advertising"><span><strong>Allow advertising cookies</strong><span>Optional. Intended for measuring ads and showing relevant ads when an advertising service is configured.</span></span></label><p class="cookie-status" id="cookie-current-choice"></p><div class="cookie-actions"><button class="cookie-button" type="submit">Save preferences</button><button class="cookie-button" type="button" data-cookie-choice="reject">Reject advertising</button></div></form><p><a href="privacy.html#cookie-choices">How we use cookies</a></p>`;

  const announcement = document.createElement('p');
  announcement.className = 'cookie-announcement';
  announcement.setAttribute('role', 'status');
  document.body.append(banner, dialog, announcement);

  const checkbox = dialog.querySelector('#cookie-advertising');
  const currentChoice = dialog.querySelector('#cookie-current-choice');
  const closeSettings = () => {
    dialog.close();
  };
  dialog.addEventListener('close', () => {
    const target = returnFocus?.isConnected && !returnFocus.closest('[hidden]')
      ? returnFocus : document.querySelector('footer [data-cookie-settings]');
    target?.focus({ preventScroll: true });
    returnFocus = null;
  });

  const savePreference = advertising => {
    preference = { version: VERSION, scope: SCOPE, advertising, expires: Date.now() + MAX_AGE * 1000 };
    let persisted = false;
    try {
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(preference))}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
      persisted = readPreference()?.advertising === advertising;
    } catch {
      // A blocked preference cookie must never enable optional tracking.
    }
    const focusedInBanner = banner.contains(document.activeElement);
    banner.hidden = true;
    if (dialog.open) closeSettings();
    if (focusedInBanner) document.querySelector('footer [data-cookie-settings]')?.focus({ preventScroll: true });
    announcement.textContent = `${advertising ? 'Advertising preference accepted.' : 'Advertising rejected.'} No advertising services are connected.${persisted ? '' : ' Your choice applies to this visit; your browser did not save the preference cookie.'}`;
    window.dispatchEvent(new CustomEvent('prg:cookie-preference', { detail: getPreference() }));
  };

  const getPreference = () => ({
    choiceMade: Boolean(preference),
    advertisingPreference: preference?.advertising ?? false,
    // Explicitly false until a named provider, disclosures, and fresh consent are implemented.
    advertisingEnabled: false,
    scope: SCOPE,
    version: VERSION
  });
  window.prgCookieConsent = Object.freeze({ getPreference });

  document.querySelectorAll('[data-cookie-settings]').forEach(control => {
    control.addEventListener('click', event => {
      event.preventDefault();
      returnFocus = control;
      checkbox.checked = preference?.advertising ?? false;
      currentChoice.textContent = preference ? `Current preference: advertising ${preference.advertising ? 'accepted' : 'rejected'}. No advertising services are active.` : 'No choice saved. Advertising is off.';
      if (!dialog.open) dialog.showModal();
      dialog.querySelector('#cookie-dialog-title').focus();
    });
  });
  document.querySelectorAll('[data-cookie-choice]').forEach(control => {
    control.addEventListener('click', () => savePreference(control.dataset.cookieChoice === 'accept'));
  });
  dialog.querySelector('.cookie-dialog-close').addEventListener('click', closeSettings);
  dialog.querySelector('#cookie-preferences').addEventListener('submit', event => {
    event.preventDefault();
    savePreference(checkbox.checked);
  });
})();
