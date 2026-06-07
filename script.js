const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

menuButton.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuButton.classList.toggle("active", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuButton.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
  observer.observe(element);
});

window.addEventListener("scroll", () => {
  const heroImage = document.querySelector(".hero-image");
  if (heroImage && window.scrollY < window.innerHeight) {
    heroImage.style.transform = `scale(1.03) translateY(${window.scrollY * 0.08}px)`;
  }
}, { passive: true });

const quoteForm = document.querySelector("#quote-form");
const formStatus = document.querySelector(".form-status");

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(quoteForm);
  const subject = encodeURIComponent(`Quote request from ${data.get("name")}`);
  const body = encodeURIComponent(
    `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nLooking for: ${data.get("product")}\n\n${data.get("message")}`,
  );

  formStatus.textContent = "Opening your email app...";
  formStatus.classList.add("visible");
  window.location.href = `mailto:sky@sky-gifts.com?subject=${subject}&body=${body}`;
});

const filters = document.querySelectorAll(".filter");
const projectCards = [...document.querySelectorAll(".project-card")];
const projectCount = document.querySelector("#project-count");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxTitle = lightbox.querySelector("strong");
const lightboxIndex = lightbox.querySelector("figcaption span");
let visibleProjects = projectCards;
let activeProjectIndex = 0;

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((item) => item.classList.toggle("active", item === filter));
    const category = filter.dataset.filter;
    projectCards.forEach((card) => {
      card.hidden = category !== "all" && !card.dataset.category.includes(category);
    });
    visibleProjects = projectCards.filter((card) => !card.hidden);
    projectCount.textContent = `${visibleProjects.length} projects`;
  });
});

function showProject(index) {
  activeProjectIndex = (index + visibleProjects.length) % visibleProjects.length;
  const project = visibleProjects[activeProjectIndex];
  lightboxImage.src = project.dataset.image;
  lightboxImage.alt = project.dataset.title;
  lightboxTitle.textContent = project.dataset.title;
  lightboxIndex.textContent = `${activeProjectIndex + 1} / ${visibleProjects.length}`;
}

projectCards.forEach((card) => {
  card.addEventListener("click", () => {
    visibleProjects = projectCards.filter((project) => !project.hidden);
    showProject(visibleProjects.indexOf(card));
    lightbox.hidden = false;
    document.body.classList.add("modal-open");
  });
});

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("modal-open");
}

lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showProject(activeProjectIndex - 1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => showProject(activeProjectIndex + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showProject(activeProjectIndex - 1);
  if (event.key === "ArrowRight") showProject(activeProjectIndex + 1);
});

/* ─── Hero Carousel ─── */
(function() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!slides.length || !dotsContainer) return;
  
  let current = 0;
  const total = slides.length;
  let interval;
  
  // 创建圆点
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });
  
  const dots = dotsContainer.querySelectorAll('.carousel-dot');
  
  function goTo(index) {
    slides[current].classList.remove('active', 'zoom-out');
    dots[current].classList.remove('active');
    
    current = index;
    
    // 当前幻灯片加 zoom-out（缓慢放大效果）
    slides[current].classList.add('active', 'zoom-out');
    dots[current].classList.add('active');
  }
  
  function next() {
    goTo((current + 1) % total);
  }
  
  function startAutoplay() {
    stopAutoplay();
    interval = setInterval(next, 5000);
  }
  
  function stopAutoplay() {
    clearInterval(interval);
  }
  
  // 第一张初始化
  slides[0].classList.add('active');
  
  // 鼠标悬停暂停
  document.querySelector('.hero-carousel').addEventListener('mouseenter', stopAutoplay);
  document.querySelector('.hero-carousel').addEventListener('mouseleave', startAutoplay);
  
  startAutoplay();
})();
