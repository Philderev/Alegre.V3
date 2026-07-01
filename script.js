/* ===================================================================
   SCRIPT.JS - core interactions (no animation/observer logic here,
   see animations.js for scroll reveals + exit intent)
   =================================================================== */


(function(){
  "use strict";

  document.addEventListener("DOMContentLoaded", function(){

    /* ---------- Floating contact CTA modal ---------- */
    var contactTrigger = document.createElement("button");
    contactTrigger.id = "theme-toggle";
    contactTrigger.type = "button";
    contactTrigger.className = "floating-contact-trigger";
    contactTrigger.setAttribute("aria-haspopup", "dialog");
    contactTrigger.setAttribute("aria-controls", "contact-action-modal");
    contactTrigger.setAttribute("aria-expanded", "false");
    contactTrigger.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.91.33 1.79.62 2.64a2 2 0 0 1-.45 2.11L8 9.75a16 16 0 0 0 6.25 6.25l1.28-1.28a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.64.62A2 2 0 0 1 22 16.92z"/></svg><span>Contact</span>';

    var contactModal = document.createElement("div");
    contactModal.id = "contact-action-modal";
    contactModal.className = "contact-action-modal";
    contactModal.setAttribute("role", "dialog");
    contactModal.setAttribute("aria-modal", "true");
    contactModal.setAttribute("aria-labelledby", "contact-action-title");
    contactModal.hidden = true;
    contactModal.innerHTML =
      '<div class="contact-action-card" role="document">' +
        '<button type="button" class="contact-action-close" aria-label="Close contact options">&times;</button>' +
        '<h2 id="contact-action-title">Contact Alegre</h2>' +
        '<p>Call us or send a message below.</p>' +
        '<div class="contact-action-options">' +
          '<a class="btn btn-primary" href="tel:7252203324">Call</a>' +
        '</div>' +
        '<div class="contact-action-form" aria-label="Growth Assessment request form">' +
          '<iframe src="https://leadhubb.alegresolutionsgs.com/widget/form/GQR6LHpUP82AX8AzvWXD" id="inline-GQR6LHpUP82AX8AzvWXD" data-layout="{\'id\':\'INLINE\'}" data-form-id="GQR6LHpUP82AX8AzvWXD" data-layout-iframe-id="inline-GQR6LHpUP82AX8AzvWXD" data-height="668" data-form-name="Growth" title="Growth Assessment form" loading="lazy"></iframe>' +
        '</div>' +
      '</div>';

    var lastFocusedContactElement = null;
    var contactCloseButton = contactModal.querySelector(".contact-action-close");
    var contactActionLinks = contactModal.querySelectorAll(".contact-action-options a");

    function openContactModal(){
      lastFocusedContactElement = document.activeElement;
      contactModal.hidden = false;
      contactModal.classList.add("is-visible");
      contactTrigger.setAttribute("aria-expanded", "true");
      contactCloseButton.focus();
    }

    function closeContactModal(){
      contactModal.classList.remove("is-visible");
      contactModal.hidden = true;
      contactTrigger.setAttribute("aria-expanded", "false");
      if(lastFocusedContactElement && typeof lastFocusedContactElement.focus === "function"){
        lastFocusedContactElement.focus();
      }
    }

    contactTrigger.addEventListener("click", openContactModal);
    contactCloseButton.addEventListener("click", closeContactModal);
    contactModal.addEventListener("click", function(e){
      if(e.target === contactModal){
        closeContactModal();
      }
    });
    contactActionLinks.forEach(function(link){
      link.addEventListener("click", closeContactModal);
    });
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape" && contactModal.classList.contains("is-visible")){
        closeContactModal();
      }
    });

    // Ensure the GHL form auto-resize script is present (only index/contact ship it inline)
    if(!document.querySelector('script[src*="form_embed.js"]')){
      var ghlScript = document.createElement("script");
      ghlScript.src = "https://leadhubb.alegresolutionsgs.com/js/form_embed.js";
      ghlScript.defer = true;
      document.body.appendChild(ghlScript);
    }

    document.body.appendChild(contactTrigger);
    document.body.appendChild(contactModal);

    /* ---------- Sticky header ---------- */
    var header = document.querySelector(".site-header");
    function onScrollHeader(){
      if(!header) return;
      if(window.scrollY > 40){ header.classList.add("is-scrolled"); }
      else{ header.classList.remove("is-scrolled"); }
    }
    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader, { passive:true });

    /* ---------- Nav white text over dark hero sections ---------- */
    var allHeroes = document.querySelectorAll(".hero, .page-hero.has-bg-image, .page-hero.trade-hero, .page-hero.service-hero");
    if(allHeroes.length && header){
      var hh = header.offsetHeight || 64;
      var navRanges = [];
      allHeroes.forEach(function(s){
        var docTop    = s.getBoundingClientRect().top    + (window.scrollY || 0);
        var docBottom = s.getBoundingClientRect().bottom + (window.scrollY || 0);
        navRanges.push({ start: docTop - hh, end: docBottom });
      });
      function updateNavLight(){
        var sy = window.scrollY || window.pageYOffset;
        var active = false;
        navRanges.forEach(function(r){ if(sy >= r.start && sy < r.end){ active = true; } });
        header.classList.toggle("nav-light", active);
        document.querySelectorAll(".nav-dropdown-menu").forEach(function(m){ m.classList.toggle("nav-light-menu", active); });
      }
      updateNavLight();
      window.addEventListener("scroll", updateNavLight, { passive: true });
    }

    /* ---------- Unnest dropdowns to body so backdrop-filter works ---------- */
    document.querySelectorAll(".nav-dropdown").forEach(function(navDrop){
      var menu = navDrop.querySelector(".nav-dropdown-menu");
      if(!menu) return;
      menu._dropParent = navDrop;
      document.body.appendChild(menu);

      var closeTimer;

      function openMenu(){
        clearTimeout(closeTimer);
        var rect = navDrop.getBoundingClientRect();
        menu.style.top = rect.bottom + "px";
        menu.style.left = rect.left + "px";
        var menuRect = menu.getBoundingClientRect();
        if(menuRect.right > window.innerWidth - 16){
          menu.style.left = Math.max(16, window.innerWidth - menuRect.width - 16) + "px";
        }
        menu.classList.add("is-open");
      }

      function closeMenu(){
        closeTimer = setTimeout(function(){ menu.classList.remove("is-open"); }, 120);
      }

      navDrop.addEventListener("mouseenter", openMenu);
      navDrop.addEventListener("mouseleave", closeMenu);
      menu.addEventListener("mouseenter", function(){ clearTimeout(closeTimer); });
      menu.addEventListener("mouseleave", closeMenu);
    });

    /* ---------- Section background color parallax ---------- */
    var bgSections = document.querySelectorAll("[data-bg]");
    if(bgSections.length){
      var bgObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            document.documentElement.style.backgroundColor = entry.target.dataset.bg;
          }
        });
      }, { threshold: 0.25 });
      bgSections.forEach(function(s){ bgObserver.observe(s); });

      /* Reset to base color when no data-bg section is in view (hero/footer) */
      var resetObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            document.documentElement.style.backgroundColor = "";
          }
        });
      }, { threshold: 0.25 });
      var hero = document.querySelector(".hero");
      if(hero) resetObserver.observe(hero);
    }

    /* ---------- Current page nav indicator ---------- */
    var currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav a[href]").forEach(function(link){
      var href = link.getAttribute("href");
      if(!href || href.indexOf("#") === 0 || href.indexOf("tel:") === 0 || href.indexOf("mailto:") === 0) return;
      var linkPage = href.split("/").pop() || "index.html";
      if(linkPage === currentPage){
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
    /* ---------- Mobile nav toggle ---------- */
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    if(toggle && nav){
      var navParent = nav.parentNode;
      var navNextSibling = nav.nextSibling;

      var closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.className = "mobile-nav-close";
      closeButton.setAttribute("aria-label", "Close menu");
      nav.prepend(closeButton);

      if(!nav.querySelector(".mobile-nav-home")){
        var homeLink = document.createElement("a");
        homeLink.className = "mobile-nav-home";
        homeLink.href = "/";
        homeLink.textContent = "Home";
        closeButton.after(homeLink);
      }

      function closeNav(){
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
        document.body.style.overflow = "";
        if(nav.parentNode !== navParent){
          navParent.insertBefore(nav, navNextSibling);
          /* Move dropdown menus back to body for desktop hover behaviour */
          document.querySelectorAll(".nav-dropdown-menu").forEach(function(m){ document.body.appendChild(m); });
        }
      }

      function openNav(){
        if(window.matchMedia("(max-width: 980px)").matches && nav.parentNode !== document.body){
          /* Re-insert dropdown menus into their parents so mobile expand works */
          document.querySelectorAll(".nav-dropdown-menu").forEach(function(m){ if(m._dropParent) m._dropParent.appendChild(m); });
          document.body.appendChild(nav);
        }
        nav.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("nav-open");
        document.body.style.overflow = "hidden";
      }

      toggle.addEventListener("click", function(){
        if(nav.classList.contains("is-open")) closeNav();
        else openNav();
      });

      closeButton.addEventListener("click", closeNav);

      document.addEventListener("keydown", function(e){
        if(e.key === "Escape" && nav.classList.contains("is-open")){
          closeNav();
        }
      });

      document.addEventListener("click", function(e){
        if(!nav.classList.contains("is-open")) return;
        if(nav.contains(e.target) || toggle.contains(e.target)) return;
        closeNav();
      });

      window.addEventListener("resize", function(){
        if(!window.matchMedia("(max-width: 980px)").matches && nav.classList.contains("is-open")){
          closeNav();
        }
      });

      nav.querySelectorAll("a").forEach(function(link){
        if(link.classList.contains("nav-dropdown-toggle")) return;
        link.addEventListener("click", closeNav);
      });

      /* Mobile: tap a dropdown label (Services / Trades) to expand/collapse its submenu */
      nav.querySelectorAll(".nav-dropdown-toggle").forEach(function(dropdownToggle){
        var dropdownWrap = dropdownToggle.closest(".nav-dropdown");
        if(!dropdownWrap) return;
        dropdownToggle.addEventListener("click", function(e){
          if(window.matchMedia("(max-width: 980px)").matches){
            e.preventDefault();
            dropdownWrap.classList.toggle("is-expanded");
          }
        });
      });
    }

    /* ---------- Back to top ---------- */
    var backToTop = document.querySelector(".back-to-top");
    if(backToTop){
      window.addEventListener("scroll", function(){
        if(window.scrollY > 600){ backToTop.classList.add("is-visible"); }
        else{ backToTop.classList.remove("is-visible"); }
      }, { passive:true });
      backToTop.addEventListener("click", function(){
        window.scrollTo({ top:0, behavior:"smooth" });
      });
    }

    /* ---------- Smooth scroll for in-page anchors ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function(link){
      link.addEventListener("click", function(e){
        var id = link.getAttribute("href");
        if(id.length < 2) return;
        var target = document.querySelector(id);
        if(target){
          e.preventDefault();
          var headerH = header ? header.offsetHeight : 0;
          var top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
          window.scrollTo({ top:top, behavior:"smooth" });
        }
      });
    });

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll(".faq-item").forEach(function(item){
      var q = item.querySelector(".faq-q");
      var a = item.querySelector(".faq-a");
      if(!q || !a) return;
      q.setAttribute("aria-expanded", "false");
      q.addEventListener("click", function(){
        var isOpen = item.classList.contains("is-open");
        // close siblings within the same list for a cleaner accordion
        var list = item.closest(".faq-list");
        if(list){
          list.querySelectorAll(".faq-item.is-open").forEach(function(openItem){
            if(openItem !== item){
              openItem.classList.remove("is-open");
              openItem.querySelector(".faq-a").style.maxHeight = null;
              openItem.querySelector(".faq-q").setAttribute("aria-expanded","false");
            }
          });
        }
        if(isOpen){
          item.classList.remove("is-open");
          a.style.maxHeight = null;
          q.setAttribute("aria-expanded","false");
        } else {
          item.classList.add("is-open");
          a.style.maxHeight = a.scrollHeight + "px";
          q.setAttribute("aria-expanded","true");
        }
      });
    });

    /* ---------- Animated counters ---------- */
    var counters = document.querySelectorAll("[data-count]");
    if(counters.length && "IntersectionObserver" in window){
      var counterObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(!entry.isIntersecting) return;
          var el = entry.target;
          var end = parseFloat(el.getAttribute("data-count"));
          var suffix = el.getAttribute("data-suffix") || "";
          var duration = 1400;
          var start = null;
          function step(ts){
            if(!start) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var value = (end * progress);
            el.textContent = (end % 1 === 0 ? Math.floor(value) : value.toFixed(1)) + suffix;
            if(progress < 1){ requestAnimationFrame(step); }
            else{ el.textContent = end + suffix; }
          }
          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        });
      }, { threshold:0.4 });
      counters.forEach(function(el){ counterObserver.observe(el); });
    }

    /* ---------- Floating-label form state (native fallback fields) ---------- */
    document.querySelectorAll(".field input, .field textarea").forEach(function(input){
      function sync(){
        var field = input.closest(".field");
        if(input.value && input.value.trim() !== ""){ field.classList.add("has-value"); }
        else{ field.classList.remove("has-value"); }
      }
      input.addEventListener("input", sync);
      input.addEventListener("blur", sync);
      sync();
    });

    /* ---------- Headline typewriter swap ---------- */
    document.querySelectorAll(".headline-word-swap").forEach(function(swap){
      var swapCurrent = swap.querySelector(".headline-word-current");
      var wordsAttr = swap.getAttribute("data-typewriter-words");
      var swapWords = wordsAttr ? wordsAttr.split("|") : ["booked job.", "signed contract.", "closed deal."];
      var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if(swapCurrent && !reduceMotion){
        var swapIndex = 0;
        var cycleDelay = 4000;
        var typeDelay = 52;
        var deleteDelay = 28;
        var emptyDelay = 120;
        var isTyping = false;

        function typeWord(word, characterIndex, onComplete){
          swapCurrent.textContent = word.slice(0, characterIndex);
          if(characterIndex < word.length){
            window.setTimeout(function(){
              typeWord(word, characterIndex + 1, onComplete);
            }, typeDelay);
          } else {
            isTyping = false;
            if(onComplete) onComplete();
          }
        }

        function deleteWord(onComplete){
          var currentText = swapCurrent.textContent;
          if(currentText.length > 0){
            swapCurrent.textContent = currentText.slice(0, -1);
            window.setTimeout(function(){
              deleteWord(onComplete);
            }, deleteDelay);
          } else if(onComplete){
            onComplete();
          }
        }

        function runSwap(){
          if(document.hidden || isTyping) return;
          isTyping = true;
          deleteWord(function(){
            swapIndex = (swapIndex + 1) % swapWords.length;
            window.setTimeout(function(){
              typeWord(swapWords[swapIndex], 1);
            }, emptyDelay);
          });
        }

        window.setInterval(runSwap, cycleDelay);
      } else if(swapCurrent) {
        swapCurrent.textContent = swapWords[0];
      }
    });

    /* ---------- Slide-up word swap ---------- */
    document.querySelectorAll(".slide-word-swap").forEach(function(swap){
      var currentWord = swap.querySelector(".slide-word-current");
      var nextWord = swap.querySelector(".slide-word-next");
      var wordsAttr = swap.getAttribute("data-slide-words");
      var slideWords = wordsAttr ? wordsAttr.split("|") : [];
      var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if(!currentWord || !nextWord || slideWords.length < 2) return;
      if(reduceMotion){
        currentWord.textContent = slideWords[0];
        return;
      }

      var slideIndex = 0;
      var slideDelay = 3000;
      var slideDuration = 520;
      var isSliding = false;

      function setSwapWidthFrom(element){
        swap.style.width = Math.ceil(element.getBoundingClientRect().width) + "px";
      }

      setSwapWidthFrom(currentWord);
      swap.classList.add("is-enhanced");

      function runSlideSwap(){
        if(document.hidden || isSliding) return;
        isSliding = true;
        slideIndex = (slideIndex + 1) % slideWords.length;
        nextWord.textContent = slideWords[slideIndex];
        setSwapWidthFrom(nextWord);

        window.requestAnimationFrame(function(){
          swap.classList.add("is-sliding");
        });

        window.setTimeout(function(){
          currentWord.textContent = slideWords[slideIndex];
          swap.classList.remove("is-sliding");
          nextWord.textContent = "";
          isSliding = false;
        }, slideDuration);
      }

      window.setInterval(runSlideSwap, slideDelay);
    });

    /* ---------- GHL embed loaded-state swap ---------- */
    document.querySelectorAll('[id^="ghl-"]').forEach(function(el){
      var obs = new MutationObserver(function(){
        if(el.querySelector("iframe")){
          el.classList.add("is-loaded");
          obs.disconnect();
        }
      });
      obs.observe(el, { childList:true });
    });

  });
})();
