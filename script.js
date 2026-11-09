/* =========================================================
   CUSTOMIZE EVERYTHING HERE (texts, dates, photos, music)
   ========================================================= */
const CONFIG = {
  name: "Fiza",
  // Local time of the device viewing the page. Format: YYYY-MM-DDTHH:MM:SS
  // (Set to "2026-11-10T00:00:00" for the real midnight surprise)
  birthday: "2026-11-09T20:56:00",
  music: "music/romantic.mp3",
  secret: "I Miss you a lot mtlb bhut jyda mill lo n jaldi. ❤️",
  letter: " ",
  // Gate shown after the countdown ends: she must type gatePhrase to continue
  gateMessage: "Wait kro thora yr, bechain kyu ho? Waise ek baar I LOVE YOU bolo pehle 😘",
  gatePhrase: "i love you baby",
  gateWrong: "Aise nahi... poora likho 😜",
  // Gallery: 6 polaroids
  photos: [
    { src: "images/photo1.jpeg", caption: "Happy Birthday My love... ❤️" },
    { src: "images/photo2.jpeg", caption: "Happy Birthday My janeman... ❤️" },
    { src: "images/photo3.jpeg", caption: "Happy Birthday My kuchupuchu... ❤️" },
    { src: "images/photo4.jpeg", caption: "Happy Birthday My Hottiee... ❤️" },
    { src: "images/photo5.jpeg", caption: "Happy Birthday My smile... ❤️" },
    { src: "images/photo6.jpeg", caption: "Happy Birthday My sweetheart... ❤️" }
  ],
  // Timeline: add or remove memories freely
  timeline: [
    { src: "images/photo7.jpeg", date: "", title: "Btao isme kya achha lga hmko", text: "" },
    { src: "images/photo8.jpeg", date: "", title: "Yr ye kitna accha tha n", text: "" },
    { src: "images/photo9.jpeg", date: "", title: "Ye wla", text: "" },
    { src: "images/photo10.jpeg", date: "", title: "Remember the Best moments together", text: "" }
  ]
};

/* ---------- Helpers ---------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const isMobile = matchMedia("(max-width:700px)").matches;
const pad = n => String(n).padStart(2, "0");
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Add ?test to the address (index.html?test) to preview the midnight moment in 8 seconds
let target = new Date(CONFIG.birthday).getTime();
if (new URLSearchParams(location.search).has("test")) target = Date.now() + 8000;

$$(".name").forEach(e => e.textContent = CONFIG.name);
$("#letterText").textContent = CONFIG.letter;
$("#secret").textContent = CONFIG.secret;

/* ---------- Loading screen ---------- */
window.addEventListener("load", () => setTimeout(() => $("#loader").classList.add("done"), 2200));

/* ---------- Background stars and floating hearts ---------- */
for (let i = 0; i < (isMobile ? 25 : 50); i++) {
  const s = document.createElement("i");
  s.className = "star";
  const size = 2 + Math.random() * 3;
  s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;animation-delay:${Math.random() * 3}s`;
  $("#sky").appendChild(s);
}
function spawnHeart() {
  if (document.hidden) return;
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = ["❤", "💗", "💖", "✨", "💜"][Math.floor(Math.random() * 5)];
  const dur = 7 + Math.random() * 6;
  h.style.cssText = `left:${Math.random() * 100}%;font-size:${14 + Math.random() * 22}px;animation-duration:${dur}s`;
  h.addEventListener("animationend", () => h.remove());
  $("#hearts").appendChild(h);
}
setInterval(spawnHeart, isMobile ? 1500 : 900);

/* ---------- Music ---------- */
const audio = $("#audio"), musicBtn = $("#music");
audio.src = CONFIG.music;
audio.addEventListener("error", () => musicBtn.hidden = true); // no music file: hide button
function playMusic() { audio.play().then(() => musicBtn.classList.remove("off")).catch(() => musicBtn.classList.add("off")); }
musicBtn.onclick = () => audio.paused ? playMusic() : (audio.pause(), musicBtn.classList.add("off"));
musicBtn.classList.add("off");

/* ---------- Fireworks and confetti (canvas) ---------- */
const cv = $("#fx"), ctx = cv.getContext("2d");
let W, H, parts = [], raf = 0;
function resize() { const r = Math.min(devicePixelRatio || 1, 1.5); W = innerWidth; H = innerHeight; cv.width = W * r; cv.height = H * r; ctx.setTransform(r, 0, 0, r, 0, 0); }
resize(); addEventListener("resize", resize);

function burst(x, y) {
  const hue = [330, 300, 270, 45, 350][Math.floor(Math.random() * 5)];
  for (let i = 0; i < (isMobile ? 32 : 60); i++) {
    const a = Math.random() * 6.283, v = 1 + Math.random() * 5;
    parts.push({ t: "f", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, hue });
  }
  kick();
}
function confetti() {
  const cols = ["#ff7fae", "#c9b6ff", "#e8c27a", "#fff", "#ffb6d0"];
  for (let i = 0; i < (isMobile ? 60 : 110); i++)
    parts.push({ t: "c", x: Math.random() * W, y: -20 - Math.random() * 200, vx: Math.random() * 2 - 1, vy: 2 + Math.random() * 3, life: 1, rot: Math.random() * 6, col: cols[i % 5] });
  kick();
}
function loop() {
  ctx.clearRect(0, 0, W, H);
  parts = parts.filter(p => p.life > 0 && p.y < H + 30);
  for (const p of parts) {
    p.x += p.vx; p.y += p.vy;
    if (p.t === "f") {
      p.vy += .05; p.vx *= .985; p.life -= .014;
      ctx.fillStyle = `hsla(${p.hue},100%,70%,${p.life})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, 6.283); ctx.fill();
    } else {
      p.rot += .1; p.life -= .002;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.col; ctx.fillRect(-4, -2, 8, 4); ctx.restore();
    }
  }
  raf = parts.length ? requestAnimationFrame(loop) : 0; // stops itself when nothing is left
}
function kick() { if (!raf) raf = requestAnimationFrame(loop); }
function fireworksShow() {
  confetti();
  let n = 0;
  const id = setInterval(() => {
    burst(W * (.15 + Math.random() * .7), H * (.1 + Math.random() * .45));
    if (++n > 14) clearInterval(id);
  }, 550);
}

/* ---------- Countdown ---------- */
let celebrated = false;
// Step 1: countdown ended, show the message and the text box
function showGate() {
  celebrated = true;
  $("#waiting").hidden = true;
  $("#gate").hidden = false;
  $("#gateMsg").textContent = CONFIG.gateMessage;
  $("#gateInput").focus();
}
// Step 2: she typed the phrase, start the celebration
function celebrate() {
  $("#gate").hidden = true;
  $("#waiting").hidden = true;
  $("#party").hidden = false;
  fireworksShow();
  playMusic();
}
// Ignores capital letters, extra spaces and punctuation
const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
$("#gateForm").onsubmit = e => {
  e.preventDefault();
  if (norm($("#gateInput").value) === norm(CONFIG.gatePhrase)) { celebrate(); return; }
  const w = $("#gateWrong");
  w.textContent = CONFIG.gateWrong; w.hidden = false;
  $("#gateInput").classList.remove("shake"); void $("#gateInput").offsetWidth; $("#gateInput").classList.add("shake");
};
function tick() {
  const diff = target - Date.now();
  if (diff <= 0) { if (!celebrated) showGate(); return; }
  $("#d").textContent = pad(Math.floor(diff / 864e5));
  $("#h").textContent = pad(Math.floor(diff / 36e5) % 24);
  $("#m").textContent = pad(Math.floor(diff / 6e4) % 60);
  $("#s").textContent = pad(Math.floor(diff / 1e3) % 60);
}
tick(); setInterval(tick, 250);

/* ---------- Page navigation ---------- */
let unlocked = false;
function goTo(n) {
  $$(".page").forEach((p, i) => p.classList.toggle("active", i === n));
  $$("#nav button").forEach((b, i) => b.classList.toggle("on", i === n));
  $("#progress").style.width = (n + 1) * 25 + "%";
  $(`#p${n}`).scrollTop = 0;
  $("#nav").hidden = !unlocked;
  if (n > 0) setTimeout(observe, 300);
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-go]");
  if (b) goTo(+b.dataset.go);
});
$("#openBtn").onclick = () => { unlocked = true; if (audio.paused) playMusic(); goTo(1); };
$("#nav button[data-go='0']").classList.add("on");

/* ---------- Gallery, lightbox, timeline ---------- */
const rot = [-5, 4, -3, 6, -6, 3];
// Shows a pink/lavender placeholder if an image file is missing
const imgTag = (src, alt) => `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="this.outerHTML='<div class=ph>💖</div>'">`;
$("#gallery").innerHTML = CONFIG.photos.map((p, i) =>
  `<figure class="polaroid reveal" style="--r:${rot[i % 6]}deg" data-i="${i}">${imgTag(p.src, p.caption)}<figcaption>${esc(p.caption)}</figcaption></figure>`).join("");
$("#timeline").innerHTML = CONFIG.timeline.map(t =>
  `<div class="t-item reveal"><div class="t-card glass">${imgTag(t.src, t.title)}<small>${esc(t.date)}</small><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></div></div>`).join("");

$("#gallery").onclick = e => {
  const f = e.target.closest(".polaroid"); if (!f) return;
  const p = CONFIG.photos[f.dataset.i], im = $("#lightbox img");
  im.src = p.src; $("#lightbox figcaption").textContent = p.caption;
  $("#lightbox").hidden = false;
};
$("#lightbox").onclick = () => $("#lightbox").hidden = true;
$("#secretBtn").onclick = () => { $("#secret").hidden = false; burst(W / 2, H / 2); };

// Reveal-on-scroll animation
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
function observe() { $$(".reveal:not(.in)").forEach(el => io.observe(el)); }

/* ---------- Envelope and letter ---------- */
$("#seal").onclick = () => {
  $("#env").classList.add("open");
  $("#hint").hidden = true;
  setTimeout(() => { $("#env").classList.add("gone"); $("#letter").classList.add("show"); for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 150); }, 1700);
};
$("#replay").onclick = () => {
  // Reset the letter, go back to page 1 and play the celebration again
  $("#env").classList.remove("open", "gone");
  $("#letter").classList.remove("show");
  $("#hint").hidden = false;
  goTo(0);
  celebrate();
};
