var map = L.map("map").setView([-30, 25], 4);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

var heatLayer = L.heatLayer(
  signalData.map((p) => [p[0], p[1], p[2]]),
  {
    radius: 20,
    blur: 15,
    maxZoom: 17,
    gradient: { 0.3: "blue", 0.6: "yellow", 1: "red" },
  }
).addTo(map);

var markers = [];

function applyFilters() {
  var carrier = document.getElementById("carrier-select").value;
  var signal = document.getElementById("signal-filter").value;
  var filteredData = signalData.filter((point) => {
    var carrierMatch = carrier === "all" || point[3] === carrier;
    var signalMatch =
      signal === "all" ||
      (signal === "strong" && point[2] > 0.8) ||
      (signal === "medium" && point[2] > 0.5 && point[2] <= 0.8) ||
      (signal === "weak" && point[2] <= 0.5);
    return carrierMatch && signalMatch;
  });

  heatLayer.setLatLngs(filteredData.map((p) => [p[0], p[1], p[2]]));
  addPulsatingMarkers(map, markers, filteredData);
  var stats = updateCounters(filteredData);
  document.getElementById("strong-count").textContent = stats.strongCount;
  document.getElementById("medium-count").textContent = stats.mediumCount;
  document.getElementById("weak-count").textContent = stats.weakCount;
  document.getElementById("problem-count").textContent = stats.problemCount;
  document.getElementById("total-coverage").textContent =
    (isNaN(stats.coverage) ? 0 : stats.coverage) + "%";
  history.push({
    timestamp: new Date().toISOString(),
    coverage: stats.coverage,
  });
}

function generateReport() {
  var carrier = document.getElementById("carrier-select").value;
  var signal = document.getElementById("signal-filter").value;
  var filteredData = signalData.filter((point) => {
    var carrierMatch = carrier === "all" || point[3] === carrier;
    var signalMatch =
      signal === "all" ||
      (signal === "strong" && point[2] > 0.8) ||
      (signal === "medium" && point[2] > 0.5 && point[2] <= 0.8) ||
      (signal === "weak" && point[2] <= 0.5);
    return carrierMatch && signalMatch;
  });

  let csvContent =
    "data:text/csv;charset=utf-8,Latitude,Longitude,Strength,Carrier,dBm,Throughput(Mbps),Latency(ms),PacketLoss(%)\n";
  filteredData.forEach((p) => {
    csvContent += `${p[0]},${p[1]},${p[2]},${p[3]},${p[4]},${p[5]},${p[6]},${p[7]}\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "signal_report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function simulateLiveUpdate() {
  var lat = -30 + (Math.random() - 0.5) * 10;
  var lng = 25 + (Math.random() - 0.5) * 10;
  var strength = Math.random();
  var carriers = ["Vodacom", "MTN", "Cell C", "Telkom"];
  var carrier = carriers[Math.floor(Math.random() * carriers.length)];
  var dBm =
    strength > 0.8
      ? -50 - Math.random() * 10
      : strength > 0.5
      ? -70 - Math.random() * 20
      : -90 - Math.random() * 30;
  var throughput =
    strength > 0.8
      ? 20 + Math.random() * 5
      : strength > 0.5
      ? 10 + Math.random() * 5
      : Math.random() * 10;
  var latency =
    strength > 0.8
      ? 30 + Math.random() * 20
      : strength > 0.5
      ? 60 + Math.random() * 40
      : 100 + Math.random() * 50;
  var packetLoss =
    strength > 0.8
      ? Math.random() * 2
      : strength > 0.5
      ? 2 + Math.random() * 3
      : 5 + Math.random() * 5;

  signalData.push([
    lat,
    lng,
    strength,
    carrier,
    dBm,
    throughput,
    latency,
    packetLoss,
  ]);
  applyFilters();
}

function togglePulsing() {
  document
    .querySelectorAll(".pulsating-marker div, .signal-color")
    .forEach((item) => {
      item.style.animationPlayState =
        item.style.animationPlayState === "paused" ? "running" : "paused";
    });
}

function searchLocation() {
  const input = document
    .getElementById("location-search")
    .value.trim()
    .toLowerCase();
  if (!input) return;
  let lat, lng;
  if (input.includes(",")) {
    [lat, lng] = input.split(",").map(Number);
  } else {
    const cities = {
      "cape town": [-33.9249, 18.4241],
      johannesburg: [-26.2041, 28.0473],
      durban: [-29.8587, 31.0218],
      pretoria: [-25.7479, 28.2293],
      "port elizabeth": [-33.9608, 25.6022],
      bloemfontein: [-29.0852, 26.1596],
      kimberley: [-28.7406, 24.772],
      "east london": [-31.6169, 29.5552],
      polokwane: [-23.8965, 29.4486],
      newcastle: [-27.7692, 30.7916],
      nelspruit: [-25.4214, 30.984],
      upington: [-28.4575, 21.2425],
      george: [-34.1833, 22.1333],
    };
    [lat, lng] = cities[input] || [-30, 25];
  }
  map.setView([lat, lng], 10);
}

document.addEventListener("DOMContentLoaded", () => {
  addPulsatingMarkers(map, markers, signalData);
  var stats = updateCounters(signalData);
  document.getElementById("strong-count").textContent = stats.strongCount;
  document.getElementById("medium-count").textContent = stats.mediumCount;
  document.getElementById("weak-count").textContent = stats.weakCount;
  document.getElementById("problem-count").textContent = stats.problemCount;
  document.getElementById("total-coverage").textContent = stats.coverage + "%";

  document
    .getElementById("report-btn")
    .addEventListener("click", generateReport);
  document
    .getElementById("simulate-update")
    .addEventListener("click", simulateLiveUpdate);
  document
    .getElementById("toggle-pulsing")
    .addEventListener("click", togglePulsing);
  document
    .getElementById("carrier-select")
    .addEventListener("change", applyFilters);
  document
    .getElementById("signal-filter")
    .addEventListener("change", applyFilters);
  document
    .getElementById("search-btn")
    .addEventListener("click", searchLocation);
});

var style = document.createElement("style");
style.textContent = `
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); }
    100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
  }
`;
document.head.appendChild(style);
