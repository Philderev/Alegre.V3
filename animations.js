/* ===================================================================
   ANIMATIONS.JS - scroll-triggered reveals
   =================================================================== */
(function(){
  "use strict";

  document.addEventListener("DOMContentLoaded", function(){

    /* ---------- Scroll reveal ---------- */
    var reveals = document.querySelectorAll(".reveal");
    if(reveals.length && "IntersectionObserver" in window){
      var revealObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold:0.15, rootMargin:"0px 0px -60px 0px" });
      reveals.forEach(function(el, i){
        el.style.setProperty("--i", i % 6);
        revealObserver.observe(el);
      });
    } else {
      reveals.forEach(function(el){ el.classList.add("is-visible"); });
    }

    /* Reset --i to local child index within each stagger group */
    document.querySelectorAll("[data-stagger]").forEach(function(container){
      container.querySelectorAll(".reveal").forEach(function(child, j){
        child.style.setProperty("--i", j);
      });
    });

    /* ---------- Typewriter word swap ---------- */
    document.querySelectorAll(".typewriter-word").forEach(function(el){
      var words = el.dataset.words.split("|");
      var textEl = el.querySelector(".typewriter-text");
      var TYPE_MS = 50;
      var DELETE_MS = 30;
      var PAUSE_MS = 2000;
      var wordIdx = 0;
      var charIdx = words[0].length;
      var deleting = false;

      function tick(){
        var word = words[wordIdx];
        if(!deleting){
          charIdx++;
          textEl.textContent = word.slice(0, charIdx);
          if(charIdx === word.length){
            setTimeout(function(){ deleting = true; tick(); }, PAUSE_MS);
            return;
          }
        } else {
          charIdx--;
          textEl.textContent = word.slice(0, charIdx);
          if(charIdx === 0){
            deleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            setTimeout(tick, 150);
            return;
          }
        }
        setTimeout(tick, deleting ? DELETE_MS : TYPE_MS);
      }

      if("IntersectionObserver" in window){
        var twObserver = new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            if(entry.isIntersecting){
              twObserver.unobserve(el);
              setTimeout(function(){ deleting = true; tick(); }, PAUSE_MS);
            }
          });
        }, { threshold: 0.5 });
        twObserver.observe(el);
      } else {
        setTimeout(function(){ deleting = true; tick(); }, PAUSE_MS);
      }
    });

  });
})();
