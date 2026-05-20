const canvas = document.querySelector("#sky");
const ctx = canvas.getContext("2d");
const shineButton = document.querySelector("#shineButton");
const fireButton = document.querySelector("#fireButton");

const colors = ["#ff3f78", "#ff7a42", "#ffd166", "#31d7c6", "#ffffff"];
let width = 0;
let height = 0;
let particles = [];
let rafId = 0;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function makeParticle(x, y, burstPower = 1) {
  const angle = Math.random() * Math.PI * 2;
  const speed = (1.7 + Math.random() * 4.6) * burstPower;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - Math.random() * 1.6,
    life: 58 + Math.random() * 38,
    maxLife: 96,
    size: 1.6 + Math.random() * 3.2,
    color: colors[Math.floor(Math.random() * colors.length)],
  };
}

function burst(x = Math.random() * width, y = height * (0.2 + Math.random() * 0.45), amount = 72) {
  const next = [];
  for (let i = 0; i < amount; i += 1) {
    next.push(makeParticle(x, y, amount > 90 ? 1.25 : 1));
  }
  particles = particles.concat(next).slice(-520);
}

function drawHeart(x, y, size, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 18, size / 18);
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(-16, -7, -6, -18, 0, -7);
  ctx.bezierCurveTo(6, -18, 16, -7, 0, 6);
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.shadowColor = color;
  ctx.shadowBlur = 14;
  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  particles = particles.filter((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.035;
    p.vx *= 0.992;
    p.life -= 1;
    const alpha = Math.max(p.life / p.maxLife, 0);
    drawHeart(p.x, p.y, p.size * 6, p.color, alpha);
    return p.life > 0;
  });

  rafId = requestAnimationFrame(animate);
}

function popHearts(x, y) {
  for (let i = 0; i < 16; i += 1) {
    const heart = document.createElement("span");
    heart.className = "burst-heart";
    heart.textContent = i % 3 === 0 ? "520" : "♥";
    heart.style.setProperty("--left", `${x + (Math.random() - 0.5) * 120}px`);
    heart.style.setProperty("--top", `${y + (Math.random() - 0.5) * 90}px`);
    heart.style.setProperty("--move", `${(Math.random() - 0.5) * 180}px`);
    heart.style.setProperty("--size", `${18 + Math.random() * 26}px`);
    heart.style.setProperty("--color", colors[Math.floor(Math.random() * colors.length)]);
    document.body.appendChild(heart);
    window.setTimeout(() => heart.remove(), 1200);
  }
}

function celebrate(originX = width / 2, originY = height / 2) {
  burst(originX, Math.max(110, originY - 90), 112);
  popHearts(originX, originY);
}

window.addEventListener("resize", resizeCanvas);
document.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button")) return;
  burst(event.clientX, event.clientY, 42);
});

shineButton.addEventListener("click", (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  celebrate(rect.left + rect.width / 2, rect.top + rect.height / 2);
});

fireButton.addEventListener("click", () => {
  burst(width * 0.25, height * 0.34, 88);
  burst(width * 0.52, height * 0.24, 92);
  burst(width * 0.78, height * 0.38, 88);
});

resizeCanvas();
animate();
window.setTimeout(() => burst(width * 0.38, height * 0.32, 70), 400);
window.setTimeout(() => burst(width * 0.72, height * 0.24, 76), 1100);
window.setInterval(() => burst(Math.random() * width, height * (0.18 + Math.random() * 0.42), 46), 4800);

window.addEventListener("beforeunload", () => cancelAnimationFrame(rafId));
