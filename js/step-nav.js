const STEPS = [
  { n: 1, href: "basics-1-grip.html", label: "1. Grip" },
  { n: 2, href: "basics-2-forehand.html", label: "2. Forehand" },
  { n: 3, href: "basics-3-backhand.html", label: "3. Backhand" },
  { n: 4, href: "basics-4-serve.html", label: "4. Serve" },
  { n: 5, href: "basics-5-volley.html", label: "5. Volley" },
  { n: 6, href: "basics-6-rally.html", label: "6. Rally" }
];
document.addEventListener("DOMContentLoaded", () => {
  const here = location.pathname.split("/").pop();
  const el = document.getElementById("step-nav");
  if (!el) return;
  el.className = "step-nav";
  el.innerHTML = `<a href="print.html">Print sheet</a>` + STEPS.map((s) =>
    `<a href="${s.href}"${s.href === here ? ' aria-current="page"' : ""}>${s.label}</a>`
  ).join("");
});
