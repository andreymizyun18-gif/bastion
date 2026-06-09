const burger = document.getElementById("burger");
const navMenu = document.getElementById("nav-menu");
const header = document.getElementById("header");

burger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  const spans = burger.querySelectorAll("span");
  if (navMenu.classList.contains("active")) {
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
    spans[1].style.opacity = "0";
    spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
  } else {
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "none";
  }
});

function scrollToSection(e) {
  e.preventDefault();
  const href = this.getAttribute("href");
  if (!href || href.startsWith("mailto:")) return;
  const target = document.querySelector(href);
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
  navMenu.classList.remove("active");
  const spans = burger.querySelectorAll("span");
  spans[0].style.transform = "none";
  spans[1].style.opacity = "1";
  spans[2].style.transform = "none";
}

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", scrollToSection);
});

document.querySelectorAll(".footer-nav-link").forEach((link) => {
  link.addEventListener("click", scrollToSection);
});

document.getElementById("logoLink").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("hero").scrollIntoView({ behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

let lastScrollTop = 0;
let currentRotation = 0;
const gear = document.getElementById("gear");

window.addEventListener(
  "scroll",
  () => {
    let scrollTop = window.scrollY;
    if (scrollTop > lastScrollTop) {
      currentRotation += 1.25;
    } else {
      currentRotation -= 1.25;
    }
    gear.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  },
  { passive: true },
);

const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);

revealElements.forEach((el) => revealObserver.observe(el));

function initTilt() {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    const inner = card.querySelector(".team-card-inner");
    const glare = card.querySelector(".glare");
    if (!inner || !glare) return;

    card.addEventListener("mousemove", (e) => {
      if (
        window.innerWidth < 768 ||
        document.body.classList.contains("dragging")
      )
        return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, transparent 50%)`;
      glare.style.opacity = "1";
    });

    card.addEventListener("mouseleave", () => {
      inner.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      glare.style.opacity = "0";
    });

    card.setAttribute("tabindex", "0");
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        inner.style.transform =
          "perspective(1000px) rotateX(-5deg) rotateY(5deg) scale3d(1.02, 1.02, 1.02)";
        setTimeout(() => {
          inner.style.transform =
            "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
        }, 300);
      }
    });
  });
}

const teamCarousel = document.getElementById("teamCarousel");
const teamTrack = document.getElementById("teamTrack");
const prevBtn = document.getElementById("teamPrev");
const nextBtn = document.getElementById("teamNext");

const originalCards = Array.from(teamTrack.children);
const originalCount = originalCards.length;

const fragmentStart = document.createDocumentFragment();
originalCards.forEach((card) =>
  fragmentStart.appendChild(card.cloneNode(true)),
);
teamTrack.insertBefore(fragmentStart, teamTrack.firstChild);

const fragmentEnd = document.createDocumentFragment();
originalCards.forEach((card) => fragmentEnd.appendChild(card.cloneNode(true)));
teamTrack.appendChild(fragmentEnd);

let allCards = Array.from(teamTrack.children);
let currentIndex = originalCount;
let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let dragDistance = 0;
let isTransitioning = false;

function getCardWidth() {
  return allCards[0].offsetWidth + 24;
}

function getCarouselWidth() {
  return teamCarousel.offsetWidth;
}

function setPositionByIndex(animate = true) {
  const cardWidth = getCardWidth();
  const carouselWidth = getCarouselWidth();
  const offset = carouselWidth / 2 - cardWidth / 2 - currentIndex * cardWidth;

  if (!animate) {
    allCards.forEach((card) => (card.style.transition = "none"));
    teamTrack.style.transition = "none";
    teamTrack.offsetHeight;

    teamTrack.style.transform = `translateX(${offset}px)`;
    updateClasses();

    teamTrack.offsetHeight;
    allCards.forEach((card) => (card.style.transition = ""));
  } else {
    isTransitioning = true;
    teamTrack.style.transition =
      "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    teamTrack.style.transform = `translateX(${offset}px)`;
    updateClasses();
  }

  prevTranslate = offset;
  currentTranslate = offset;
}

function updateClasses() {
  allCards.forEach((card, i) => {
    card.classList.remove(
      "center",
      "side-left",
      "side-right",
      "far-left",
      "far-right",
      "hidden",
    );
    const diff = i - currentIndex;
    if (diff === 0) card.classList.add("center");
    else if (diff === -1) card.classList.add("side-left");
    else if (diff === 1) card.classList.add("side-right");
    else if (diff < -1) card.classList.add("far-left");
    else if (diff > 1) card.classList.add("far-right");
  });
}

function checkLoop() {
  if (isDragging) return;

  let resetIndex = null;

  if (currentIndex < originalCount) {
    resetIndex = currentIndex + originalCount;
  } else if (currentIndex >= originalCount * 2) {
    resetIndex = currentIndex - originalCount;
  }

  if (resetIndex !== null) {
    currentIndex = resetIndex;
    setPositionByIndex(false);
  }

  isTransitioning = false;
}

teamTrack.addEventListener("transitionend", (e) => {
  if (e.propertyName === "transform" && e.target === teamTrack) {
    checkLoop();
  }
});

function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

function touchStart(event) {
  if (isTransitioning) return;
  isDragging = true;
  document.body.classList.add("dragging");
  startX = getPositionX(event);
  teamTrack.style.transition = "none";
}

function touchMove(event) {
  if (isDragging) {
    const currentX = getPositionX(event);
    const diff = currentX - startX;
    dragDistance = Math.abs(diff);
    currentTranslate = prevTranslate + diff;
    teamTrack.style.transform = `translateX(${currentTranslate}px)`;
    if (event.type === "touchmove") event.preventDefault();
  }
}

function touchEnd() {
  if (!isDragging) return;
  isDragging = false;
  document.body.classList.remove("dragging");
  const movedBy = currentTranslate - prevTranslate;

  if (Math.abs(movedBy) < 50) {
    setPositionByIndex();
  } else {
    if (movedBy < -50) currentIndex++;
    if (movedBy > 50) currentIndex--;
    setPositionByIndex();
  }
  dragDistance = 0;
}

teamCarousel.addEventListener("mousedown", touchStart);
teamCarousel.addEventListener("touchstart", touchStart);
teamCarousel.addEventListener("mousemove", touchMove);
teamCarousel.addEventListener("touchmove", touchMove, { passive: false });
teamCarousel.addEventListener("mouseup", touchEnd);
teamCarousel.addEventListener("mouseleave", touchEnd);
teamCarousel.addEventListener("touchend", touchEnd);

prevBtn.addEventListener("click", () => {
  if (isTransitioning) return;
  currentIndex--;
  setPositionByIndex();
});

nextBtn.addEventListener("click", () => {
  if (isTransitioning) return;
  currentIndex++;
  setPositionByIndex();
});

window.addEventListener("resize", () => {
  requestAnimationFrame(() => setPositionByIndex(false));
});

teamTrack.addEventListener("click", (e) => {
  if (dragDistance > 10) return;
  const card = e.target.closest(".team-card");
  if (!card) return;
  const id = card.dataset.id;
  if (id) openModal(id);
});

initTilt();

// Фикс: ждём полной загрузки ВСЕХ изображений на странице перед инициализацией карусели
function initCarousel() {
  const allImages = document.querySelectorAll("img");
  const totalImages = allImages.length;
  let loadedImages = 0;
  let initialized = false;

  function tryInit() {
    if (initialized) return;
    loadedImages++;
    if (loadedImages >= totalImages || document.readyState === "complete") {
      initialized = true;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPositionByIndex(false));
      });
    }
  }

  if (totalImages === 0 || document.readyState === "complete") {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPositionByIndex(false));
    });
    return;
  }

  allImages.forEach((img) => {
    if (img.complete && img.naturalHeight !== 0) {
      tryInit();
    } else {
      img.addEventListener("load", tryInit, { once: true });
      img.addEventListener("error", tryInit, { once: true });
    }
  });

  // Fallback: принудительная инициализация через 2 секунды
  setTimeout(() => {
    if (!initialized) {
      initialized = true;
      requestAnimationFrame(() => setPositionByIndex(false));
    }
  }, 2000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCarousel);
} else {
  initCarousel();
}

const teamData = {
  angro: {
    name: "Балабанов Мирон",
    role: "Проджект менеджер",
    nick: "Angro",
    skills: ["Управление рисками", "SCRUM", "Agile", "Планирование спринтов"],
    email: "angro@bastion-team.ru",
    about:
      "Руководитель проектов с фокусом на эффективность, прозрачность процессов и соблюдение сроков. Верю, что хороший менеджер — это тот, кто делает работу команды заметной.",
    contacts: { tg: "@angro", vk: "vk.com/angro" },
  },
  yarok: {
    name: "Кирсанов Ярослав",
    role: "Бэкенд-разработчик",
    nick: "Yarok",
    skills: ["Python", "Rust", "Docker", "Kubernetes", "Автоматизация"],
    email: "yarok@bastion-team.ru",
    about:
      "Бэкенд-разработчик & DevOps-энтузиаст. Автоматизирую всё: от деплоя через Docker/K8s до серверной логики на Python и Rust. Превращаю идеи в работающую инфраструктуру. Студент, инженер, практик.",
    contacts: { tg: "@yarok", vk: "vk.com/yarok" },
  },
  green_ya: {
    name: "Зеленский Ярослав",
    role: "DevOps",
    nick: "Green_ya",
    skills: [
      "CI/CD",
      "Docker",
      "Kubernetes",
      "Linux",
      "Автоматизация инфраструктуры",
    ],
    email: "green_ya@bastion-team.ru",
    about:
      "Инфраструктура как код — мой подход к любой задаче. Автоматизирую рутину и строю отказоустойчивые пайплайны.",
    contacts: { tg: "@green_ya", vk: "vk.com/green_ya" },
  },
  murai: {
    name: "Полина",
    role: "Фронтенд",
    nick: "Murai",
    skills: ["HTML/CSS", "JavaScript", "Vue.js", "Адаптивная верстка", "UI/UX"],
    email: "murai@bastion-team.ru",
    about:
      "Создаю интерфейсы, которые приятно использовать. Внимание к деталям и pixel-perfect подход в каждом проекте.",
    contacts: { tg: "@murai", vk: "vk.com/murai" },
  },
  isqqka: {
    name: "Ислам",
    role: "DevOps",
    nick: "isqqka",
    skills: [
      "CI/CD",
      "Docker",
      "Kubernetes",
      "Linux",
      "Автоматизация инфраструктуры",
    ],
    email: "isqqka@bastion-team.ru",
    about:
      "Всем привет я иска и я кароче работаю рабом в этой команде. Я ничего толком не знаю поэтому и работаю рабом (лан я чуть шарю за линух и всее). Не знаю что писать дальше всем пока.",
    contacts: { tg: "@isqqka", vk: "vk.com/isqqka" },
  },
};

const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalImg = document.getElementById("modalImg");

function openModal(id) {
  const data = teamData[id];
  if (!data) return;

  modalImg.src = `img/${id}.png`;
  modalImg.alt = data.name;

  document.getElementById("modalName").textContent = data.name;
  document.getElementById("modalRole").textContent = data.role;
  document.getElementById("modalNick").textContent = data.nick;
  document.getElementById("modalSkills").innerHTML = data.skills
    .map((s) => `<li>${s}</li>`)
    .join("");
  document.getElementById("modalAbout").textContent = data.about;
  document.getElementById("modalEmail").href = `mailto:${data.email}`;
  document.getElementById("modalEmailText").textContent = data.email;
  document.getElementById("modalTg").href =
    `https://t.me/${data.contacts.tg.replace("@", "")}`;
  document.getElementById("modalTgText").textContent = data.contacts.tg;
  document.getElementById("modalVk").href = `https://${data.contacts.vk}`;
  document.getElementById("modalVkText").textContent = data.contacts.vk;

  modalOverlay.classList.add("active");
  document.body.classList.add("modal-open");
}

function closeModal() {
  modalOverlay.classList.remove("active");
  document.body.classList.remove("modal-open");
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
