// SentinelShield dashboard frontend
// Flask API must be running at http://127.0.0.1:5000
const API_BASE = "http://127.0.0.1:5000";
const REFRESH_INTERVAL = 2000;

const $ = (id) => document.getElementById(id);
let sensorChart = null;
let threatChart = null;
let sparkAnomalyChart = null;
let sparkThreatChart = null;
let lastRecordId = null;

function prettyAnomaly(value) {
  const labels = {
    NORMAL: "NORMAL",
    PERSON_DETECT: "PERSON DETECTED",
    FUEL_THEFT: "FUEL THEFT",
    VIBRATION_DETECT: "VIBRATION ALERT"
  };
  return labels[value] || (value || "UNKNOWN").replaceAll("_", " ");
}

function levelClass(level) {
  const normalized = String(level || "").toUpperCase();
  if (normalized === "HIGH") return "level-high";
  if (normalized === "MEDIUM") return "level-medium";
  return "level-low";
}

function formatTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString([], { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function setConnection(connected, message = "") {
  $("connectionText").textContent = connected ? "API Connected" : "API Offline";
  $("connectionSub").textContent = connected ? "Receiving sensor records" : (message || "Check Flask server");
  const dot = document.querySelector(".system-card .pulse-dot");
  dot.style.background = connected ? "var(--green)" : "var(--red)";
  dot.style.boxShadow = connected ? "0 0 0 4px rgba(56,214,163,.1)" : "0 0 0 4px rgba(255,101,122,.1)";
}

function updateOverview(data) {
  if (!data || !Object.keys(data).length) return;

  const fuel = Number(data.fuel_level ?? data.fuel ?? 0);
  const distance = Number(data.distance ?? 0);
  const score = Number(data.threat_score ?? 0);
  const anomaly = data.anomaly || "UNKNOWN";
  const level = data.threat_level || "LOW";

  $("fuelValue").textContent = Number.isFinite(fuel) ? fuel.toFixed(0) : "--";
  $("fuelBar").style.width = `${Math.max(0, Math.min(100, fuel))}%`;
  $("fuelState").textContent = fuel <= 20 ? "Low fuel" : fuel <= 50 ? "Moderate" : "Healthy";

  $("distanceValue").textContent = Number.isFinite(distance) ? distance.toFixed(0) : "--";
  $("anomalyValue").textContent = prettyAnomaly(anomaly);
  $("anomalyDescription").textContent = anomaly === "NORMAL" ? "No anomaly reported by hardware" : "A sensor event has been reported";
  $("anomalyTime").textContent = formatTime(data.created_at);
  $("anomalyValue").className = "anomaly-value " + (level === "HIGH" ? "high" : level === "MEDIUM" ? "medium" : "");

  $("threatValue").textContent = Number.isFinite(score) ? score.toFixed(0) : "--";
  $("threatBar").style.width = `${Math.max(0, Math.min(100, score))}%`;
  $("threatLevel").textContent = level;

  const banner = $("statusBanner");
  banner.className = "status-banner" + (level === "HIGH" ? " danger" : level === "MEDIUM" ? " warning" : "");
  $("bannerIcon").textContent = level === "HIGH" ? "!" : level === "MEDIUM" ? "⚠" : "✓";
  $("bannerTitle").textContent = level === "HIGH" ? "High-priority security event" : level === "MEDIUM" ? "Attention: person detected" : "Vehicle monitoring is normal";
  $("bannerMessage").textContent = `${prettyAnomaly(anomaly)} · Threat assessment: ${level} (${score}/100)`;
  $("lastUpdated").textContent = `LAST UPDATE ${formatTime(data.created_at)}`;
}

function initCharts() {
  if (typeof Chart === "undefined") return;
  const commonOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: "#172941", titleColor: "#edf4ff", bodyColor: "#c5d4e8", borderColor: "rgba(151,177,215,.2)", borderWidth: 1 } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#7588a2", maxTicksLimit: 7, font: { size: 9 } }, border: { display: false } },
      y: { grid: { color: "rgba(151,177,215,.08)" }, ticks: { color: "#7588a2", font: { size: 9 } }, border: { display: false } }
    }
  };
  const sensorCtx = $("sensorChart");
  if (sensorCtx) {
    sensorChart = new Chart(sensorCtx, {
      type: "line",
      data: { labels: [], datasets: [
        { label: "Fuel (%)", data: [], borderColor: "#42d6e8", backgroundColor: "rgba(66,214,232,.08)", fill: true, tension: .35, pointRadius: 2, pointHoverRadius: 5, borderWidth: 2 },
        { label: "Distance (cm)", data: [], borderColor: "#a58cff", backgroundColor: "rgba(165,140,255,.04)", fill: false, tension: .35, pointRadius: 2, pointHoverRadius: 5, borderWidth: 2 }
      ] },
      options: { ...commonOptions, interaction: { intersect: false, mode: "index" } }
    });
  }
  const threatCtx = $("threatChart");
  if (threatCtx) {
    threatChart = new Chart(threatCtx, {
      type: "doughnut",
      data: { labels: ["Normal", "Person detected", "Fuel / vibration"], datasets: [{ data: [0,0,0], backgroundColor: ["#38d6a3","#ffbd59","#ff657a"], borderColor: "#111f34", borderWidth: 4, hoverOffset: 5 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: "76%", plugins: { legend: { display: false }, tooltip: { backgroundColor: "#172941", titleColor: "#edf4ff", bodyColor: "#c5d4e8" } } }
    });
  }
}

function initSparkCharts() {
  if (typeof Chart === "undefined") return;

  const anomalyCanvas = $("sparkAnomalyChart");
  const threatCanvas = $("sparkThreatChart");

  if (anomalyCanvas) {
    sparkAnomalyChart = new Chart(anomalyCanvas, {
      type: "doughnut",
      data: {
        labels: [
          "Normal",
          "Person Detection",
          "Fuel Theft",
          "Vibration Detection"
        ],
        datasets: [{
          data: [0, 0, 0, 0],
          backgroundColor: [
            "#38d6a3",
            "#ffbd59",
            "#ff657a",
            "#a58cff"
          ],
          borderColor: "#111f34",
          borderWidth: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#c5d4e8",
              padding: 15,
              font: { size: 11 }
            }
          }
        }
      }
    });
  }

  if (threatCanvas) {
    sparkThreatChart = new Chart(threatCanvas, {
      type: "bar",
      data: {
        labels: ["Low", "Medium", "High"],
        datasets: [{
          label: "Number of Events",
          data: [0, 0, 0],
          backgroundColor: ["#38d6a3", "#ffbd59", "#ff657a"],
          borderRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: { color: "#91a4bd" },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "#91a4bd",
              precision: 0
            },
            grid: { color: "rgba(151,177,215,.08)" }
          }
        }
      }
    });
  }
}

function updateSparkAnalytics(data) {
  if (!data || !Object.keys(data).length) {
    $("analyticsStatus").textContent = "NO ANALYTICS DATA";
    return;
  }

  const number = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  $("sparkTotal").textContent = number(data.total_events);
  $("sparkHigh").textContent = number(data.high_threat_events);
  $("sparkMedium").textContent = number(data.medium_threat_events);
  $("sparkLow").textContent = number(data.low_threat_events);

  $("sparkNormal").textContent = number(data.normal_events);
  $("sparkPerson").textContent = number(data.person_detections);
  $("sparkFuelTheft").textContent = number(data.fuel_theft_events);
  $("sparkVibration").textContent = number(data.vibration_events);

  $("sparkAvgFuel").textContent = number(data.average_fuel).toFixed(2);
  $("sparkAvgDistance").textContent = number(data.average_distance).toFixed(2);
  $("sparkAvgThreat").textContent = number(data.average_threat_score).toFixed(2);
  $("sparkMaxThreat").textContent = number(data.maximum_threat_score).toFixed(2);

  $("sparkGeneratedAt").textContent =
    data.generated_at ? formatTime(data.generated_at) : "Not available";

  $("analyticsStatus").textContent = "SPARK DATA CONNECTED";

  if (sparkAnomalyChart) {
    sparkAnomalyChart.data.datasets[0].data = [
      number(data.normal_events),
      number(data.person_detections),
      number(data.fuel_theft_events),
      number(data.vibration_events)
    ];

    sparkAnomalyChart.update("none");
  }

  if (sparkThreatChart) {
    sparkThreatChart.data.datasets[0].data = [
      number(data.low_threat_events),
      number(data.medium_threat_events),
      number(data.high_threat_events)
    ];

    sparkThreatChart.update("none");
  }
}

async function refreshSparkAnalytics() {
  try {
    const response = await fetch(
      `${API_BASE}/analytics`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Analytics API returned an error");
    }

    const data = await response.json();
    updateSparkAnalytics(data);

  } catch (error) {
    $("analyticsStatus").textContent = "ANALYTICS OFFLINE";
    console.error("Spark analytics error:", error);
  }
}


function updateHistory(rows) {
  const body = $("historyBody");
  if (!Array.isArray(rows) || rows.length === 0) {
    body.innerHTML = '<tr><td colspan="6" class="empty-state">No sensor records available yet.</td></tr>';
    return;
  }

  const recent = rows.slice(0, 8);
  body.innerHTML = recent.map(row => {
    const score = Number(row.threat_score || 0);
    const level = row.threat_level || "LOW";
    return `<tr>
      <td class="event-name">${prettyAnomaly(row.anomaly)}</td>
      <td>${Number(row.fuel_level).toFixed(0)}%</td>
      <td>${Number(row.distance).toFixed(0)} cm</td>
      <td>${score.toFixed(0)} / 100</td>
      <td><span class="level-pill ${levelClass(level)}">${level}</span></td>
      <td>${formatTime(row.created_at)}</td>
    </tr>`;
  }).join("");

  const normal = rows.filter(r => r.anomaly === "NORMAL").length;
  const person = rows.filter(r => r.anomaly === "PERSON_DETECT").length;
  const high = rows.filter(r => ["FUEL_THEFT", "VIBRATION_DETECT"].includes(r.anomaly)).length;
  $("eventCount").textContent = rows.length;
  $("normalCount").textContent = normal;
  $("personCount").textContent = person;
  $("highCount").textContent = high;

  if (threatChart) {
    threatChart.data.datasets[0].data = [normal, person, high];
    threatChart.update("none");
  }

  if (sensorChart) {
    const chartRows = [...rows].reverse().slice(-30);
    sensorChart.data.labels = chartRows.map(r => {
      const d = new Date(r.created_at);
      return Number.isNaN(d.getTime()) ? "" : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    });
    sensorChart.data.datasets[0].data = chartRows.map(r => Number(r.fuel_level));
    sensorChart.data.datasets[1].data = chartRows.map(r => Number(r.distance));
    sensorChart.update("none");
  }
}

async function refreshDashboard() {
  try {
    const [latestResponse, historyResponse] = await Promise.all([
      fetch(`${API_BASE}/latest`, { cache: "no-store" }),
      fetch(`${API_BASE}/history`, { cache: "no-store" })
    ]);
    if (!latestResponse.ok || !historyResponse.ok) throw new Error("API returned an error");
    const latest = await latestResponse.json();
    const history = await historyResponse.json();

    setConnection(true);
    updateOverview(latest);
    updateHistory(history);

    if (latest && latest.id !== lastRecordId && latest.id !== undefined) {
      lastRecordId = latest.id;
    }
  } catch (error) {
    setConnection(false, "Unable to reach Flask API");
    $("bannerTitle").textContent = "Connection to API lost";
    $("bannerMessage").textContent = "Keep Flask running and check the API address in script.js.";
  }
}

$("currentDate").textContent = new Date().toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });
$("refreshBtn").addEventListener("click", () => {
  refreshDashboard();
  const toast = $("toast");
  toast.textContent = "Dashboard refresh requested";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
});
$("menuBtn").addEventListener("click", () => $("sidebar").classList.toggle("open"));

initCharts();
initSparkCharts();

refreshDashboard();
refreshSparkAnalytics();

setInterval(refreshDashboard, REFRESH_INTERVAL);
setInterval(refreshSparkAnalytics, 10000);
