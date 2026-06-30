/* ===================================================================
   COOKIE-CONSENT.JS
   Stores consent in localStorage as "alegre_cookie_consent":
     { essential:true, analytics:bool, marketing:bool, ts:ISOString }
   Blocks analytics/marketing scripts (data-cookie-category attribute)
   until accepted. Banner wording aligned with NRS 603A disclosure intent
   plus general US/CCPA-style transparency (this site does not target EU
   users, so no GDPR claim is made - see privacy-policy.html for scope).
   =================================================================== */
(function(){
  "use strict";

  var STORAGE_KEY = "alegre_cookie_consent";

  function getConsent(){
    try{
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch(e){ return null; }
  }

  function setConsent(consent){
    consent.ts = new Date().toISOString();
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(consent)); } catch(e){}
    applyConsent(consent);
    document.dispatchEvent(new CustomEvent("alegre:consent-updated", { detail: consent }));
  }

  function applyConsent(consent){
    // Activate any deferred scripts tagged with data-cookie-category.
    // Markup pattern: <script type="text/plain" data-cookie-category="analytics" data-src="...">
    document.querySelectorAll("script[data-cookie-category]").forEach(function(tag){
      var category = tag.getAttribute("data-cookie-category");
      if(consent[category] && tag.type === "text/plain"){
        var live = document.createElement("script");
        if(tag.dataset.src){ live.src = tag.dataset.src; }
        else { live.text = tag.textContent; }
        tag.parentNode.replaceChild(live, tag);
      }
    });
  }

  function buildBanner(){
    var wrap = document.createElement("div");
    wrap.className = "cookie-banner";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-label", "Cookie Preferences");
    wrap.innerHTML =
      '<div class="cookie-banner-inner">' +
        '<div class="cookie-banner-text">' +
          '<strong>Cookie Preferences</strong>' +
          '<p>We use cookies to ensure the site works properly and to improve your experience. ' +
          'Essential cookies are always enabled. You can choose whether to allow analytics and marketing cookies.</p>' +
          '<p class="cookie-banner-links">Learn more in our <a href="/cookie-policy.html">Cookie Policy</a> ' +
          'and <a href="/privacy-policy.html">Privacy Policy</a>.</p>' +
        '</div>' +
        '<div class="cookie-banner-actions">' +
          '<button type="button" class="btn btn-outline btn-sm" data-cookie="settings">Cookie Settings</button>' +
          '<button type="button" class="btn btn-outline btn-sm" data-cookie="decline">Decline Non-Essential</button>' +
          '<button type="button" class="btn btn-primary btn-sm" data-cookie="accept">Accept All</button>' +
        '</div>' +
      '</div>';
    return wrap;
  }

  function buildSettingsPanel(){
    var panel = document.createElement("div");
    panel.className = "cookie-settings-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Cookie Settings");
    panel.innerHTML =
      '<div class="cookie-settings-card">' +
        '<h4>Cookie Settings</h4>' +
        '<p>Choose which optional cookies Alegre Solutions GS can use on this device. You can change this anytime from the link in our footer.</p>' +
        '<div class="cookie-toggle-row">' +
          '<div><strong>Essential</strong><p>Required for the site to function. Always on.</p></div>' +
          '<input type="checkbox" checked disabled aria-label="Essential cookies, always on">' +
        '</div>' +
        '<div class="cookie-toggle-row">' +
          '<div><strong>Analytics</strong><p>Helps us understand site traffic and improve performance.</p></div>' +
          '<input type="checkbox" id="cookie-toggle-analytics" aria-label="Analytics cookies">' +
        '</div>' +
        '<div class="cookie-toggle-row">' +
          '<div><strong>Marketing</strong><p>Used for ad performance tracking and retargeting.</p></div>' +
          '<input type="checkbox" id="cookie-toggle-marketing" aria-label="Marketing cookies">' +
        '</div>' +
        '<div class="cookie-settings-actions">' +
          '<button type="button" class="btn btn-outline btn-sm" data-cookie="cancel">Cancel</button>' +
          '<button type="button" class="btn btn-primary btn-sm" data-cookie="save">Save Preferences</button>' +
        '</div>' +
      '</div>';
    return panel;
  }

  function showBanner(banner){ banner.classList.add("is-visible"); }
  function hideBanner(banner){ banner.classList.remove("is-visible"); }
  function showSettings(settings){ settings.classList.add("is-visible"); }
  function hideSettings(settings){ settings.classList.remove("is-visible"); }

  document.addEventListener("DOMContentLoaded", function(){
    var existing = getConsent();
    if(existing){ applyConsent(existing); }

    var banner = buildBanner();
    var settings = buildSettingsPanel();
    document.body.appendChild(banner);
    document.body.appendChild(settings);

    if(!existing){
      setTimeout(function(){ showBanner(banner); }, 350);
    }

    banner.addEventListener("click", function(e){
      var action = e.target.getAttribute("data-cookie");
      if(!action) return;
      if(action === "accept"){
        setConsent({ essential:true, analytics:true, marketing:true });
        hideBanner(banner);
      } else if(action === "decline"){
        setConsent({ essential:true, analytics:false, marketing:false });
        hideBanner(banner);
      } else if(action === "settings"){
        showSettings(settings);
      }
    });

    settings.addEventListener("click", function(e){
      var action = e.target.getAttribute("data-cookie");
      if(action === "cancel"){
        hideSettings(settings);
      } else if(action === "save"){
        var analytics = settings.querySelector("#cookie-toggle-analytics").checked;
        var marketing = settings.querySelector("#cookie-toggle-marketing").checked;
        setConsent({ essential:true, analytics:analytics, marketing:marketing });
        hideSettings(settings);
        hideBanner(banner);
      }
    });

    // Footer "Cookie Settings" relink (any element with data-open-cookie-settings)
    document.querySelectorAll("[data-open-cookie-settings]").forEach(function(btn){
      btn.addEventListener("click", function(e){
        e.preventDefault();
        var current = getConsent() || { analytics:false, marketing:false };
        settings.querySelector("#cookie-toggle-analytics").checked = !!current.analytics;
        settings.querySelector("#cookie-toggle-marketing").checked = !!current.marketing;
        showSettings(settings);
      });
    });
  });

  window.AlegreConsent = { get:getConsent, set:setConsent };
})();
