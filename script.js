(function(){
  "use strict";

  // ---- Navbar frosted state on scroll ----
  var navbar = document.getElementById("navbar");
  function onScroll(){
    if(window.scrollY > 20){ navbar.classList.add("scrolled"); }
    else{ navbar.classList.remove("scrolled"); }
  }
  document.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  // ---- Mobile nav toggle ----
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", function(){
    var isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  navLinks.querySelectorAll("a").forEach(function(link){
    link.addEventListener("click", function(){
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // ---- Scroll-spy active link ----
  var sections = Array.prototype.slice.call(document.querySelectorAll("main .section[id]"));
  var navItems = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var spy = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      var id = entry.target.id;
      navItems.forEach(function(link){
        link.classList.toggle("active", link.getAttribute("href") === "#" + id);
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
  sections.forEach(function(sec){ spy.observe(sec); });

  // ---- Scroll reveal ----
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function(el){ revealObserver.observe(el); });

  // ---- Modal ----
  var openButtons = Array.prototype.slice.call(document.querySelectorAll("[data-open-modal]"));
  var closeButtons = Array.prototype.slice.call(document.querySelectorAll("[data-close-modal]"));
  var activeModal = null;

  function openModal(modal){
    if(activeModal && activeModal !== modal) closeModal(activeModal, true);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-panel").scrollTop = 0;
    activeModal = modal;
    if(location.hash !== "#" + modal.id){
      history.replaceState(null, "", "#" + modal.id);
    }
  }
  function closeModal(modal, keepHash){
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    activeModal = null;
    if(!keepHash && location.hash === "#" + modal.id){
      history.replaceState(null, "", "#applications");
    }
  }

  function openModalFromHash(){
    var id = location.hash.slice(1);
    var modal = id ? document.getElementById(id) : null;
    if(modal && modal.classList.contains("modal-backdrop")){
      openModal(modal);
    }
  }
  window.addEventListener("hashchange", openModalFromHash);
  openModalFromHash();

  openButtons.forEach(function(btn){
    btn.addEventListener("click", function(){
      var modal = document.getElementById(btn.getAttribute("data-open-modal"));
      if(modal) openModal(modal);
    });
  });
  closeButtons.forEach(function(btn){
    btn.addEventListener("click", function(){
      var modal = btn.closest(".modal-backdrop");
      if(modal) closeModal(modal);
    });
  });
  document.querySelectorAll(".modal-backdrop").forEach(function(modal){
    modal.addEventListener("click", function(e){
      if(e.target === modal) closeModal(modal);
    });
  });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && activeModal) closeModal(activeModal);
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Ginger cat that walks after the pointer ----
  if(!reduceMotion && window.matchMedia("(pointer: fine)").matches){
    var EYE = "#2a1407";
    var GINGER = "#f08a24", STRIPE = "#c4601a", CREAM = "#ffe3c2";

    var FACE =
      '<path d="M9 26 L13 3 L31 14 Z" fill="' + GINGER + '"/><path d="M55 26 L51 3 L33 14 Z" fill="' + GINGER + '"/>' +
      '<path d="M14 21 L16 9 L26 14.5 Z" fill="#f7a1a8"/><path d="M50 21 L48 9 L38 14.5 Z" fill="#f7a1a8"/>' +
      '<ellipse cx="32" cy="38" rx="24" ry="21" fill="' + GINGER + '"/>' +
      '<g stroke="' + STRIPE + '" stroke-width="2.4" stroke-linecap="round" fill="none">' +
        '<path d="M32 18 V25"/><path d="M25.5 19.5 L27.5 25.5"/><path d="M38.5 19.5 L36.5 25.5"/>' +
        '<path d="M9.5 35 L15.5 36.5"/><path d="M10 41 L16 40"/><path d="M54.5 35 L48.5 36.5"/><path d="M54 41 L48 40"/>' +
      '</g>' +
      '<ellipse cx="32" cy="46.5" rx="11" ry="7.5" fill="' + CREAM + '"/>' +
      '<path d="M29 42 L35 42 L32 45.5 Z" fill="#f2788a"/>' +
      '<g stroke="' + CREAM + '" stroke-width="1.3" stroke-linecap="round" opacity=".85">' +
        '<path d="M20 46 L5 43.5"/><path d="M20 48.5 L6 51"/><path d="M44 46 L59 43.5"/><path d="M44 48.5 L58 51"/>' +
      '</g>' +
      '<path d="M32 45.5 V48" stroke="' + EYE + '" stroke-width="1.8" stroke-linecap="round" fill="none"/>' +
      '<g class="mood m-happy" fill="none" stroke="' + EYE + '" stroke-width="2.6" stroke-linecap="round">' +
        '<path d="M16.5 37 Q22 30.5 27.5 37"/><path d="M36.5 37 Q42 30.5 47.5 37"/>' +
        '<path d="M26.5 48.5 Q29 52.5 32 48 Q35 52.5 37.5 48.5" stroke-width="2"/>' +
        '<circle cx="15" cy="43" r="3" fill="#ff7a8a" stroke="none" opacity=".45"/><circle cx="49" cy="43" r="3" fill="#ff7a8a" stroke="none" opacity=".45"/>' +
      '</g>' +
      '<g class="mood m-curious">' +
        '<circle cx="22" cy="36" r="5.4" fill="#fff"/><circle cx="42" cy="36" r="5.4" fill="#fff"/>' +
        '<circle cx="23.4" cy="35.4" r="3" fill="' + EYE + '"/><circle cx="43.4" cy="35.4" r="3" fill="' + EYE + '"/>' +
        '<circle cx="24.4" cy="34.2" r="1" fill="#fff"/><circle cx="44.4" cy="34.2" r="1" fill="#fff"/>' +
        '<path d="M29.5 49.5 Q32 51.5 34.5 49.5" fill="none" stroke="' + EYE + '" stroke-width="2" stroke-linecap="round"/>' +
      '</g>' +
      '<g class="mood m-surprised">' +
        '<circle cx="22" cy="36" r="6.6" fill="#fff"/><circle cx="42" cy="36" r="6.6" fill="#fff"/>' +
        '<circle cx="22" cy="36" r="2.6" fill="' + EYE + '"/><circle cx="42" cy="36" r="2.6" fill="' + EYE + '"/>' +
        '<ellipse cx="32" cy="51" rx="2.8" ry="3.2" fill="#7a2a1a"/>' +
      '</g>' +
      '<g class="mood m-grumpy">' +
        '<path d="M16.5 36 H27.5 A5.5 5.5 0 0 1 16.5 36 Z" fill="#fff"/><path d="M36.5 36 H47.5 A5.5 5.5 0 0 1 36.5 36 Z" fill="#fff"/>' +
        '<circle cx="22" cy="38.4" r="2.4" fill="' + EYE + '"/><circle cx="42" cy="38.4" r="2.4" fill="' + EYE + '"/>' +
        '<g fill="none" stroke="' + EYE + '" stroke-width="2.8" stroke-linecap="round"><path d="M15 30 L28 34"/><path d="M49 30 L36 34"/><path d="M27.5 51 Q32 47.5 36.5 51" stroke-width="2"/></g>' +
      '</g>' +
      '<g class="mood m-love">' +
        '<path transform="translate(22 36) scale(1.7)" d="M0 3.2 C-4.5 -0.8 -2.6 -4.8 0 -2.2 C2.6 -4.8 4.5 -0.8 0 3.2 Z" fill="#ff4d6d"/>' +
        '<path transform="translate(42 36) scale(1.7)" d="M0 3.2 C-4.5 -0.8 -2.6 -4.8 0 -2.2 C2.6 -4.8 4.5 -0.8 0 3.2 Z" fill="#ff4d6d"/>' +
        '<path d="M26.5 48.5 Q29 52.5 32 48 Q35 52.5 37.5 48.5" fill="none" stroke="' + EYE + '" stroke-width="2" stroke-linecap="round"/>' +
      '</g>' +
      '<g class="mood m-sleep" fill="none" stroke="' + EYE + '" stroke-width="2.4" stroke-linecap="round">' +
        '<path d="M17 36.5 Q22 40.5 27 36.5"/><path d="M37 36.5 Q42 40.5 47 36.5"/><path d="M30 49 Q32 50.5 34 49" stroke-width="2"/>' +
      '</g>';

    function leg(x, cls, far){
      var fur = far ? "#cf6f17" : GINGER, paw = far ? "#e8c49a" : CREAM;
      return '<g transform="translate(' + x + ' 57)"><g class="leg ' + cls + '">' +
        '<rect x="-4" y="0" width="8" height="17" rx="4" fill="' + fur + '"/>' +
        '<ellipse cx="0" cy="17" rx="5.6" ry="3" fill="' + paw + '"/></g></g>';
    }
    function tail(d){
      return '<path d="' + d + '" fill="none" stroke="' + GINGER + '" stroke-width="7" stroke-linecap="round"/>' +
             '<path d="' + d + '" fill="none" stroke="' + STRIPE + '" stroke-width="7" stroke-dasharray="2.5 8.5"/>';
    }
    function backStripes(y){
      return '<g stroke="' + STRIPE + '" stroke-width="2.6" stroke-linecap="round" fill="none">' +
        '<path d="M42 ' + (y + 3.5) + ' q2.5 5 0 9.5"/><path d="M52 ' + (y + 1.5) + ' q2.5 5 0 10"/>' +
        '<path d="M62 ' + (y + 1) + ' q2.5 5 0 10"/><path d="M72 ' + (y + 2) + ' q2.5 5 0 9.5"/></g>';
    }

    var WALK =
      '<g class="pose-walk">' +
        '<g class="tail">' + tail("M27 45 C9 46 5 28 15 19") + '</g>' +
        leg(44, "leg-b", true) + leg(72, "leg-a", true) +
        '<g class="torso">' +
          '<ellipse cx="58" cy="47" rx="35" ry="16.5" fill="' + GINGER + '"/>' +
          '<ellipse cx="60" cy="58" rx="22" ry="4.6" fill="' + CREAM + '"/>' + backStripes(30) +
        '</g>' +
        leg(38, "leg-a", false) + leg(78, "leg-b", false) +
        '<g class="head"><g transform="translate(81 11) scale(.62)">' + FACE + '</g></g>' +
      '</g>';

    var SLEEP =
      '<g class="pose-sleep">' +
        '<g class="sleep-body">' +
          '<ellipse cx="60" cy="59" rx="40" ry="17" fill="' + GINGER + '"/>' + backStripes(42) +
          tail("M30 70 C46 80 92 80 104 70") +
          '<ellipse cx="86" cy="73" rx="6" ry="3.2" fill="' + CREAM + '"/>' +
        '</g>' +
        '<g class="head"><g transform="translate(78 31) scale(.62) rotate(10 32 32)">' + FACE + '</g></g>' +
      '</g>';

    var CAT_HTML =
      '<span class="cat-z z1">z</span><span class="cat-z z2">z</span><span class="cat-z z3">Z</span>' +
      '<div class="cat-hop"><div class="cat-flip"><svg class="cat-svg" viewBox="0 0 130 80" width="112" height="69">' +
      WALK + SLEEP + '</svg></div></div>';

    var MOODS = ["happy", "curious", "surprised", "grumpy", "love"];
    var IDLE_MS = 5000, MAX_SPEED = 300, HALF_W = 56, HALF_H = 34;
    var cat = document.createElement("div");
    cat.className = "cat-buddy";
    cat.setAttribute("aria-hidden", "true");
    cat.setAttribute("data-mood", "happy");
    cat.setAttribute("data-dir", "right");
    cat.innerHTML = CAT_HTML;
    document.body.appendChild(cat);

    var mood = "happy", sleeping = false, reacting = false, started = false, moving = false;
    var mouse = { x: 0, y: 0 }, cx = 0, cy = 0, facing = "right", fast = false, lastTs = 0;
    var rafId = 0, idleTimer = 0, moodTimer = 0, reactTimer = 0;

    var STEP_PX = 30, MAX_PRINTS = 60;
    var stride = 0, leftFoot = false;
    var steps = document.createElement("div");
    steps.className = "foot-steps";
    steps.setAttribute("aria-hidden", "true");
    document.body.appendChild(steps);

    function footprint(ux, uy){
      leftFoot = !leftFoot;
      var side = leftFoot ? 1 : -1;
      var x = cx - uy * 6 * side;
      var y = cy + 28 + ux * 6 * side;
      var angle = Math.atan2(uy, ux) * 180 / Math.PI + 90;

      var ns = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(ns, "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("class", "foot-print");
      var use = document.createElementNS(ns, "use");
      use.setAttribute("href", "#paw");
      svg.appendChild(use);
      svg.style.left = (x + window.scrollX) + "px";
      svg.style.top = (y + window.scrollY) + "px";
      svg.style.setProperty("--rot", angle + "deg");
      svg.addEventListener("animationend", function(){ svg.remove(); });
      steps.appendChild(svg);

      while(steps.childNodes.length > MAX_PRINTS){
        steps.removeChild(steps.firstChild);
      }
    }

    function setMood(m){ mood = m; cat.setAttribute("data-mood", m); }
    function randomMood(){
      var pool = MOODS.filter(function(m){ return m !== mood; });
      setMood(pool[Math.floor(Math.random() * pool.length)]);
    }
    function scheduleMood(){
      clearTimeout(moodTimer);
      moodTimer = setTimeout(function(){
        if(!sleeping && !reacting) randomMood();
        scheduleMood();
      }, 4000 + Math.random() * 4000);
    }
    function hop(){
      cat.classList.remove("hop");
      void cat.offsetWidth;
      cat.classList.add("hop");
    }
    function react(m, ms){
      reacting = true;
      setMood(m);
      hop();
      clearTimeout(reactTimer);
      reactTimer = setTimeout(function(){
        reacting = false;
        if(!sleeping) randomMood();
      }, ms);
    }
    function fallAsleep(){
      sleeping = true;
      reacting = false;
      cat.classList.remove("walking");
      cat.classList.add("asleep");
      setMood("sleep");
    }
    function tryAsleep(){
      if(moving){ idleTimer = setTimeout(tryAsleep, 600); return; }
      fallAsleep();
    }
    function wake(){
      if(!sleeping) return;
      sleeping = false;
      cat.classList.remove("asleep");
      react("surprised", 700);
    }
    function resetIdle(){
      clearTimeout(idleTimer);
      idleTimer = setTimeout(tryAsleep, IDLE_MS);
    }

    function target(){
      var ox = 76, oy = 30;
      if(mouse.x > window.innerWidth - 170) ox = -76;
      if(mouse.y > window.innerHeight - 90) oy = -26;
      return { x: mouse.x + ox, y: mouse.y + oy };
    }
    function place(){
      cat.style.transform = "translate3d(" + (cx - HALF_W) + "px," + (cy - HALF_H) + "px,0)";
    }
    function frame(ts){
      var dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0.016;
      lastTs = ts;
      var t = target();
      var dx = t.x - cx, dy = t.y - cy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var speed = Math.min(MAX_SPEED, dist * 3.2);
      var nowMoving = !sleeping && speed > 28;

      if(nowMoving){
        var step = Math.min(speed * dt, dist);
        cx += dx / dist * step;
        cy += dy / dist * step;
        stride += step;
        if(stride >= STEP_PX){
          stride -= STEP_PX;
          footprint(dx / dist, dy / dist);
        }
        if(Math.abs(dx) > 8){
          var dir = dx > 0 ? "right" : "left";
          if(dir !== facing){ facing = dir; cat.setAttribute("data-dir", dir); }
        }
        var nowFast = speed > 190;
        if(nowFast !== fast){
          fast = nowFast;
          cat.style.setProperty("--step", fast ? ".36s" : ".52s");
        }
        place();
      }
      if(nowMoving !== moving){
        moving = nowMoving;
        cat.classList.toggle("walking", moving);
      }
      if(moving){ rafId = requestAnimationFrame(frame); } else { rafId = 0; lastTs = 0; }
    }

    document.addEventListener("pointermove", function(e){
      if(e.pointerType === "touch") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if(!started){
        started = true;
        var t = target();
        cx = -HALF_W - 20;
        cy = t.y;
        place();
        cat.classList.add("show");
        scheduleMood();
      }
      wake();
      resetIdle();
      if(!rafId) rafId = requestAnimationFrame(frame);
    }, { passive: true });

    document.addEventListener("pointerdown", function(e){
      if(e.pointerType === "touch" || !started) return;
      if(sleeping){ wake(); } else { react("surprised", 800); }
      resetIdle();
    });

    document.addEventListener("pointerover", function(e){
      if(e.pointerType === "touch" || sleeping || reacting || !e.target.closest) return;
      if(e.target.closest("a, button")) setMood("curious");
    });
  }

})();
