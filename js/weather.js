const WX = {
  lat: 52.2053,
  lon: 0.1218,
  tz: "Europe/London",
  seasonEnd: "2026-12-31",
  windowStart: 9,
  windowEnd: 11
};

const WMO = {
  0: { icon: "☀️", en: "Clear" },
  1: { icon: "🌤️", en: "Mainly clear" },
  2: { icon: "⛅", en: "Partly cloudy" },
  3: { icon: "☁️", en: "Overcast" },
  45: { icon: "🌫️", en: "Fog" },
  48: { icon: "🌫️", en: "Rime fog" },
  51: { icon: "🌦️", en: "Light drizzle" },
  53: { icon: "🌦️", en: "Drizzle" },
  55: { icon: "🌧️", en: "Dense drizzle" },
  61: { icon: "🌧️", en: "Light rain" },
  63: { icon: "🌧️", en: "Rain" },
  65: { icon: "🌧️", en: "Heavy rain" },
  71: { icon: "🌨️", en: "Light snow" },
  73: { icon: "🌨️", en: "Snow" },
  75: { icon: "❄️", en: "Heavy snow" },
  80: { icon: "🌦️", en: "Light showers" },
  81: { icon: "🌧️", en: "Showers" },
  82: { icon: "⛈️", en: "Heavy showers" },
  95: { icon: "⛈️", en: "Thunderstorm" },
  96: { icon: "⛈️", en: "Thunderstorm + hail" },
  99: { icon: "⛈️", en: "Severe thunderstorm" }
};

function tx(key, fallback) {
  if (typeof window.t === "function") return window.t(key);
  return fallback || key;
}

function londonNow() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: WX.tz }));
}

function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function remainingInYear(now) {
  const end = new Date(`${WX.seasonEnd}T23:59:59`);
  const ms = Math.max(0, end - now);
  const hours = Math.floor(ms / 3600000);
  const days = Math.ceil(ms / 86400000);
  const saturdays = remainingSaturdays(now);
  return { ms, hours, days, saturdays, end };
}

function remainingSaturdays(now) {
  const end = new Date(`${WX.seasonEnd}T12:00:00`);
  const d = new Date(now);
  d.setHours(12, 0, 0, 0);
  const add = (6 - d.getDay() + 7) % 7;
  if (d.getDay() !== 6) d.setDate(d.getDate() + add);
  const out = [];
  while (d <= end) {
    out.push(ymd(d));
    d.setDate(d.getDate() + 7);
  }
  return out;
}

function nextSaturday(now) {
  const d = new Date(now);
  d.setHours(12, 0, 0, 0);
  if (d.getDay() !== 6) d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7));
  return d;
}

function hourlySlice(hourly, dateStr, startH, endH) {
  const rows = [];
  for (let i = 0; i < hourly.time.length; i++) {
    const t = hourly.time[i];
    if (!t.startsWith(dateStr)) continue;
    const h = Number(t.slice(11, 13));
    if (h >= startH && h <= endH) {
      rows.push({
        hour: h,
        temp: hourly.temperature_2m[i],
        pop: hourly.precipitation_probability[i],
        rain: hourly.precipitation[i],
        wind: hourly.windspeed_10m[i],
        code: hourly.weathercode[i]
      });
    }
  }
  return rows;
}

function playCall(rows) {
  if (!rows.length) return { level: "maybe", key: "wx_call_maybe" };
  const rain = rows.reduce((s, r) => s + r.rain, 0);
  const pop = Math.max(...rows.map((r) => r.pop));
  const wind = Math.max(...rows.map((r) => r.wind));
  const temp = rows.reduce((s, r) => s + r.temp, 0) / rows.length;
  if (rain >= 1 || pop >= 70 || wind >= 40 || temp < 4) return { level: "stop", key: "wx_call_stop", rain, pop, wind, temp };
  if (rain >= 0.2 || pop >= 40 || wind >= 25 || temp < 8 || temp > 28) return { level: "maybe", key: "wx_call_maybe", rain, pop, wind, temp };
  return { level: "go", key: "wx_call_go", rain, pop, wind, temp };
}

function kitAdvice(call) {
  const bits = [];
  if (call.temp != null && call.temp < 12) bits.push(tx("wx_kit_layers", "Layers and a dry bag for extras"));
  if (call.temp != null && call.temp >= 20) bits.push(tx("wx_kit_water", "Extra water — hard courts heat up"));
  if (call.pop != null && call.pop >= 30) bits.push(tx("wx_kit_rain", "Pack a jacket; courts stay slippery after a shower"));
  if (call.wind != null && call.wind >= 20) bits.push(tx("wx_kit_wind", "Expect swirl on the open Pieces courts"));
  if (!bits.length) bits.push(tx("wx_kit_fair", "Fair outdoor tennis weather — racket, balls, shoes, tea"));
  return bits;
}

function wmoLabel(code) {
  const row = WMO[code] || { icon: "🌡️", en: "Mixed" };
  return `${row.icon} ${row.en}`;
}

function fmtNum(n, digits) {
  if (n == null || Number.isNaN(n)) return "—";
  return Number(n).toFixed(digits);
}

async function loadForecast() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${WX.lat}&longitude=${WX.lon}&current=temperature_2m,weathercode,windspeed_10m,precipitation&hourly=temperature_2m,precipitation_probability,precipitation,windspeed_10m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max&timezone=${encodeURIComponent(WX.tz)}&forecast_days=7`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("forecast " + res.status);
  return res.json();
}

function renderYear(now) {
  const rem = remainingInYear(now);
  const daysEl = document.getElementById("wx-days");
  const hoursEl = document.getElementById("wx-hours");
  const satsEl = document.getElementById("wx-sats");
  const listEl = document.getElementById("wx-sat-list");
  if (daysEl) daysEl.textContent = String(rem.days);
  if (hoursEl) hoursEl.textContent = String(rem.hours);
  if (satsEl) satsEl.textContent = String(rem.saturdays.length);
  if (listEl) {
    listEl.innerHTML = rem.saturdays.map((d) => `<li><time datetime="${d}">${d}</time></li>`).join("");
  }
}

function renderNow(data) {
  const c = data.current;
  const el = document.getElementById("wx-now");
  if (!el || !c) return;
  el.innerHTML = `
    <strong>${fmtNum(c.temperature_2m, 0)}°C</strong>
    <span>${wmoLabel(c.weathercode)}</span>
    <span>${fmtNum(c.windspeed_10m, 0)} km/h</span>
  `;
}

function renderSession(data, now) {
  const sat = nextSaturday(now);
  const dateStr = ymd(sat);
  const rows = hourlySlice(data.hourly, dateStr, WX.windowStart, WX.windowEnd);
  const call = playCall(rows);
  const banner = document.getElementById("wx-call");
  const hours = document.getElementById("wx-hours-table");
  const kit = document.getElementById("wx-kit");
  const when = document.getElementById("wx-session-when");
  if (when) when.textContent = `${dateStr} · 09:15–11:15`;
  if (banner) {
    banner.className = "wx-call wx-" + call.level;
    banner.textContent = tx(call.key);
  }
  if (hours) {
    hours.innerHTML = rows.map((r) => `
      <tr>
        <td>${String(r.hour).padStart(2, "0")}:00</td>
        <td>${wmoLabel(r.code)}</td>
        <td>${fmtNum(r.temp, 0)}°C</td>
        <td>${fmtNum(r.pop, 0)}%</td>
        <td>${fmtNum(r.rain, 1)} mm</td>
        <td>${fmtNum(r.wind, 0)} km/h</td>
      </tr>
    `).join("");
  }
  if (kit) kit.textContent = kitAdvice(call).join(". ") + ".";
  const wa = document.getElementById("wx-wa");
  if (wa) {
    const text = `🎾 Cambridge tennis weather — ${dateStr}
Christ's Pieces 09:15–11:15
${tx(call.key)}
${rows.map((r) => `${String(r.hour).padStart(2, "0")}:00 ${fmtNum(r.temp, 0)}°C · rain ${fmtNum(r.pop, 0)}% · ${fmtNum(r.wind, 0)} km/h`).join("\n")}
Year left: ${remainingInYear(now).days} days, ${remainingInYear(now).saturdays.length} Saturdays.
Confirm who is in tonight.`;
    wa.href = "https://wa.me/?text=" + encodeURIComponent(text);
  }
}

function renderOutlook(data) {
  const root = document.getElementById("wx-outlook");
  if (!root) return;
  const d = data.daily;
  root.innerHTML = d.time.map((day, i) => `
    <article class="card">
      <span class="tag">${day}</span>
      <h3>${wmoLabel(d.weathercode[i])}</h3>
      <p>${fmtNum(d.temperature_2m_min[i], 0)}–${fmtNum(d.temperature_2m_max[i], 0)}°C</p>
      <p class="muted">${tx("wx_rain", "Rain")} ${fmtNum(d.precipitation_sum[i], 1)} mm · ${tx("wx_pop", "Rain chance")} ${fmtNum(d.precipitation_probability_max[i], 0)}% · ${tx("wx_wind", "Wind")} ${fmtNum(d.windspeed_10m_max[i], 0)} km/h</p>
    </article>
  `).join("");
}

async function initWeather() {
  const status = document.getElementById("wx-status");
  const now = londonNow();
  renderYear(now);
  try {
    const data = await loadForecast();
    renderNow(data);
    renderSession(data, now);
    renderOutlook(data);
    if (status) status.hidden = true;
  } catch (err) {
    if (status) status.textContent = tx("wx_err", "Could not load the forecast. Try again in a minute.");
  }
}

window.renderWeather = initWeather;
document.addEventListener("DOMContentLoaded", initWeather);
document.addEventListener("i18n:applied", initWeather);
