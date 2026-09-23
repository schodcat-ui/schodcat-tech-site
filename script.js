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

  // ---- Hero cursor spotlight ----
  var hero = document.querySelector(".hero");
  var spotlight = document.getElementById("heroSpotlight");
  if(hero && spotlight && window.matchMedia("(pointer: fine)").matches){
    hero.addEventListener("mousemove", function(e){
      var rect = hero.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      spotlight.style.setProperty("--x", x + "%");
      spotlight.style.setProperty("--y", y + "%");
    });
  }

  // ---- Glass card tilt ----
  var tiltCards = Array.prototype.slice.call(document.querySelectorAll(".app-card, .value-card"));
  if(window.matchMedia("(pointer: fine)").matches){
    tiltCards.forEach(function(card){
      card.addEventListener("mousemove", function(e){
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = "translateY(-6px) rotateX(" + (py * -6) + "deg) rotateY(" + (px * 8) + "deg)";
      });
      card.addEventListener("mouseleave", function(){
        card.style.transform = "";
      });
    });
  }

  // ---- Modal ----
  var openButtons = Array.prototype.slice.call(document.querySelectorAll("[data-open-modal]"));
  var closeButtons = Array.prototype.slice.call(document.querySelectorAll("[data-close-modal]"));
  var activeModal = null;

  function openModal(modal){
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    activeModal = modal;
  }
  function closeModal(modal){
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    activeModal = null;
  }

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

})();
