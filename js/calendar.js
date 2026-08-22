const SESSIONS = [
  { date: "2026-08-08", whenKey: "s1_when", courtKey: "s1_court", statusKey: "s1_status", notesKey: "s1_notes", kit: ["Play Tennis app", "£3", "racket"] },
  { date: "2026-08-11", whenKey: "s2_when", courtKey: "s2_court", statusKey: "s2_status", notesKey: "s2_notes", kit: ["balls if you have a can"] },
  { date: "2026-08-15", whenKey: "s3_when", courtKey: "s3_court", statusKey: "s3_status", notesKey: "s3_notes", kit: ["balls brought by a regular"] },
  { date: "2026-08-22", whenKey: "s4_when", courtKey: "s4_court", statusKey: "s4_status", notesKey: "s4_notes", kit: ["balls confirmed", "junior welcome", "£3 Saturday"] },
  { date: "2026-08-29", whenKey: "s5_when", courtKey: "s5_court", statusKey: "s5_status", notesKey: "s5_notes", kit: ["book early"] },
  { date: "2026-09-05", whenKey: "s6_when", courtKey: "s6_court", statusKey: "s6_status", notesKey: "s6_notes", kit: ["own racket", "share balls"] }
];

function tx(key, fallback) {
  if (typeof window.t === "function") return window.t(key);
  return fallback || key;
}

function renderCalendar() {
  const root = document.getElementById("calendar");
  if (!root) return;
  root.innerHTML = SESSIONS.map((s) => `
    <article class="session">
      <div>
        <time datetime="${s.date}">${s.date}</time>
        <div class="muted">${tx(s.whenKey)}</div>
        <span class="tag">${tx(s.statusKey)}</span>
      </div>
      <div>
        <strong>${tx(s.courtKey)}</strong>
        <p>${tx(s.notesKey)}</p>
        <div class="kit">${s.kit.map((k) => `<span>${k}</span>`).join("")}</div>
      </div>
    </article>
  `).join("");
}

window.renderCalendar = renderCalendar;
document.addEventListener("DOMContentLoaded", renderCalendar);
