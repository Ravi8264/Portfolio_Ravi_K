// Typing animation for the span element
const typingText = document.getElementById("typing-text");
const texts = [
  "Full-Stack Engineer",
  "Node.js Backend Developer",
  "React Developer",
  "Real-Time Systems Engineer",
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeText() {
  const currentText = texts[textIndex];

  if (isDeleting) {
    // Deleting text
    typingText.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // Typing text
    typingText.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }

  // Set typing speed - faster and smoother
  let typeSpeed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentText.length) {
    // Pause at end of typing
    typeSpeed = 1500;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Move to next text
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
    typeSpeed = 300;
  }

  setTimeout(typeText, typeSpeed);
}

// 3D skill globe — tags ek sphere par baithte hain aur poora sphere ghoomta
// hai. Koi library nahi: har tag ek absolutely-positioned span hai jise har
// frame par rotate ki hui 3D position se transform kiya jaata hai.
const GLOBE_SKILLS = [
  "Node.js", "TypeScript", "JavaScript", "React 19", "PostgreSQL",
  "Firebase RTDB", "Cloud Functions", "Express.js", "REST APIs", "JWT",
  "MQTT", "WebSockets", "FCM Push", "IndexedDB", "Redux",
  "Docker", "CI/CD", "Git", "Java", "Python",
  "SQL", "MySQL", "MongoDB", "Tailwind CSS", "Geofencing",
  "GPS Streaming", "App Check", "PayU", "Google Maps API", "Linux",
];

function initSkillGlobe() {
  const globe = document.getElementById("skill-globe");
  if (!globe) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nodes = GLOBE_SKILLS.map((label) => {
    const el = document.createElement("span");
    el.textContent = label;
    globe.appendChild(el);
    return el;
  });

  // Fibonacci sphere — points sphere par barabar bant jaate hain, isliye
  // kahin bhi tags ka jhund nahi banta.
  const total = nodes.length;
  const points = nodes.map((el, i) => {
    const phi = Math.acos(-1 + (2 * i + 1) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;
    return {
      el,
      x: Math.cos(theta) * Math.sin(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(phi),
    };
  });

  let angleX = -0.25;
  let angleY = 0;
  let speedX = 0;
  let speedY = reduceMotion ? 0 : 0.0035;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  function render() {
    // Globe ka radius container ke saath scale karta hai taaki chhoti
    // screens par tags bahar na nikle.
    const radius = globe.clientWidth * 0.4;
    // depth jitna bada, perspective utni halki -- 3.2 par aage wale tags
    // bahut bade nahi hote aur globe balanced dikhta hai.
    const depth = radius * 3.2;
    const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
    const cosY = Math.cos(angleY), sinY = Math.sin(angleY);

    for (const p of points) {
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      const scale = depth / (depth - z2 * radius);
      const opacity = Math.max(0.18, Math.min(1, (z2 + 1.1) / 2));

      p.el.style.transform =
        `translate(-50%, -50%) translate3d(${x1 * radius * scale}px, ${y2 * radius * scale}px, 0) scale(${scale})`;
      p.el.style.opacity = opacity.toFixed(3);
      // Aage wale tags peeche walon ke upar rahein.
      p.el.style.zIndex = Math.round(z2 * 100);
    }
  }

  function tick() {
    if (!dragging) {
      angleY += speedY;
      angleX += speedX;
      // Drag ke baad ki extra speed dheere-dheere idle spin par lautti hai.
      speedY += ((reduceMotion ? 0 : 0.0035) - speedY) * 0.04;
      speedX += (0 - speedX) * 0.04;
    }
    render();
    requestAnimationFrame(tick);
  }

  function onPointerDown(e) {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    globe.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    angleY += dx * 0.006;
    angleX -= dy * 0.006;
    speedY = dx * 0.0012;
    speedX = -dy * 0.0012;
  }

  function onPointerUp(e) {
    dragging = false;
    if (globe.hasPointerCapture(e.pointerId)) globe.releasePointerCapture(e.pointerId);
  }

  if (!reduceMotion) {
    globe.addEventListener("pointerdown", onPointerDown);
    globe.addEventListener("pointermove", onPointerMove);
    globe.addEventListener("pointerup", onPointerUp);
    globe.addEventListener("pointercancel", onPointerUp);
  }

  render();
  requestAnimationFrame(tick);
}

// Cards par 3D tilt — pointer ki position se rotateX/rotateY nikaalte hain.
// Inline transform hover wale CSS transform ko override karta hai, aur
// pointer hatte hi inline style hata dete hain taaki CSS wapas sambhaal le.
function initCardTilt() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(hover: hover)").matches) return;

  const cards = document.querySelectorAll(".skill-box, .project-box");
  const MAX_TILT = 7; // degrees

  cards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `rotateX(${(-py * MAX_TILT).toFixed(2)}deg) rotateY(${(px * MAX_TILT).toFixed(2)}deg) translateZ(1.2rem)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

// Theme color picker — 50 swatches, picking one recolors every --main-color
// accent across the site (buttons, glows, headings, icons).
function generateThemeColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = Math.round((360 / count) * i);
    const sat = 70 + (i % 3) * 8;
    const light = 55 + (i % 2) * 5;
    colors.push(`hsl(${hue} ${sat}% ${light}%)`);
  }
  return colors;
}

function initThemePicker() {
  const btn = document.getElementById("theme-btn");
  const panel = document.getElementById("theme-panel");
  if (!btn || !panel) return;

  const colors = generateThemeColors(50);
  const saved = localStorage.getItem("portfolioThemeColor");

  colors.forEach((color) => {
    const swatch = document.createElement("button");
    swatch.type = "button";
    swatch.className = "theme-swatch";
    swatch.style.background = color;
    swatch.style.color = color;
    swatch.title = color;
    swatch.setAttribute("aria-label", `Set theme color ${color}`);
    if (saved === color) swatch.classList.add("selected");

    swatch.addEventListener("click", () => {
      document.documentElement.style.setProperty("--main-color", color);
      localStorage.setItem("portfolioThemeColor", color);
      panel
        .querySelectorAll(".theme-swatch")
        .forEach((s) => s.classList.remove("selected"));
      swatch.classList.add("selected");
    });

    panel.appendChild(swatch);
  });

  if (saved) {
    document.documentElement.style.setProperty("--main-color", saved);
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = panel.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(isOpen));
    panel.setAttribute("aria-hidden", String(!isOpen));
  });

  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && !btn.contains(e.target)) {
      panel.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
    }
  });
}

// Start the typing animation when page loads
document.addEventListener("DOMContentLoaded", function () {
  typeText();
  initSkillGlobe();
  initCardTilt();
  initThemePicker();
});
