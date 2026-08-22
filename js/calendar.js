const SESSIONS = [
  {
    date: "2026-08-08",
    when: "Saturday 09:15–10:00",
    court: "Christ's Pieces · Court 4 (outdoor hard)",
    status: "Booked & paid",
    notes: "Sample Play Tennis booking: £3 for a 45-minute slot. Erdem covers Saturday court fees. Gate PIN stays in the app, not on this site.",
    kit: ["Play Tennis app", "£3", "racket"]
  },
  {
    date: "2026-08-11",
    when: "Tuesday 15:00–17:00",
    court: "Cambridge city courts (TBC)",
    status: "Weekday float",
    notes: "Joker slot: one learner available after 15:00. Confirm on the group chat the night before.",
    kit: ["balls if you have a can"]
  },
  {
    date: "2026-08-15",
    when: "Saturday morning",
    court: "Jesus Green or fallback court",
    status: "Played / mixed turnout",
    notes: "Balls were covered by a regular. Scoring practice offered. A few people paused this week.",
    kit: ["balls brought by a regular"]
  },
  {
    date: "2026-08-22",
    when: "Saturday morning",
    court: "Christ's Pieces (default) — confirm in Play Tennis",
    status: "Open",
    notes: "Balls confirmed. Family-friendly: a new junior is starting. Aim for four players. Erdem pays the Saturday slot.",
    kit: ["balls confirmed", "junior welcome", "£3 Saturday"]
  },
  {
    date: "2026-08-29",
    when: "Late August weekend",
    court: "TBC — court scout back in town",
    status: "Planned",
    notes: "Court scout returns around month-end. Good week to lock a shaded court again.",
    kit: ["book early"]
  },
  {
    date: "2026-09-05",
    when: "From September",
    court: "Rotate Jesus Green / St Ives / city parks",
    status: "Recurring",
    notes: "Scoring partner aims to rejoin after September. Kids court when enough juniors show up.",
    kit: ["own racket", "share balls"]
  }
];

function renderCalendar() {
  const root = document.getElementById("calendar");
  if (!root) return;
  root.innerHTML = SESSIONS.map((s) => `
    <article class="session">
      <div>
        <time datetime="${s.date}">${s.date}</time>
        <div class="muted">${s.when}</div>
        <span class="tag">${s.status}</span>
      </div>
      <div>
        <strong>${s.court}</strong>
        <p>${s.notes}</p>
        <div class="kit">${s.kit.map((k) => `<span>${k}</span>`).join("")}</div>
      </div>
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", renderCalendar);
