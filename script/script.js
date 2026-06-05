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

const cards = document.querySelectorAll("[data-tilt]");

cards.forEach((card) => {
  const inner = card.querySelector(".team-card-inner");
  const glare = card.querySelector(".glare");

  card.addEventListener("mousemove", (e) => {
    if (window.innerWidth < 768) return;
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

// Modal logic
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
    skills: ["Python", "Go", "Базы данных", "Оптимизация запросов", "REST API"],
    email: "yarok@bastion-team.ru",
    about:
      "Архитектор серверной части и оптимизатор высоких нагрузок. Любит чистый код и чёткие контракты API.",
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
      "Строю инфраструктуру, которая работает сама по себе. Автоматизация, мониторинг и отказоустойчивость — мои главные принципы.",
    contacts: { tg: "@isqqka", vk: "vk.com/isqqka" },
  },
  tofawawa: {
    name: "Рименсонс Тимофей",
    role: "Фронтенд-разработчик",
    nick: "tofawawa",
    skills: [
      "JavaScript",
      "Vue.js",
      "CSS Grid",
      "Адаптивная верстка",
      "Pixel Art стили",
    ],
    email: "tofawawa@bastion-team.ru",
    about:
      "Интерфейсы должны быть не только красивыми, но и удобными. Верю в силу деталей и пиксель-перфект вёрстку.",
    contacts: { tg: "@tofawawa", vk: "vk.com/tofawawa" },
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

document.querySelectorAll(".team-card").forEach((card) => {
  card.addEventListener("click", () => {
    const id = card.dataset.id;
    if (id) openModal(id);
  });
});
