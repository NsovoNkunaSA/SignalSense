// Initialize map with wider view
var map = L.map("map").setView([-30, 25], 4); // Centered on Southern Africa with zoom level 4

// Add tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Expanded signal data across multiple regions
var signalData = [
  // South Africa signals
  [-33.9249, 18.4241, 0.9, "Vodacom", -52], // Cape Town - strong
  [-33.95, 18.45, 0.3, "MTN", -105], // Cape Town area - weak
  [-34.0, 18.5, 0.7, "Vodacom", -72], // Cape Town area - medium
  [-33.93, 18.42, 0.85, "MTN", -58], // Cape Town area - strong
  [-33.91, 18.41, 0.65, "Vodacom", -75], // Cape Town area - medium

  // Johannesburg signals
  [-26.2041, 28.0473, 0.8, "MTN", -55], // Johannesburg - strong
  [-26.15, 28.1, 0.4, "Vodacom", -95], // Johannesburg area - weak
  [-26.25, 28.0, 0.75, "Cell C", -70], // Johannesburg area - medium

  // Durban signals
  [-29.8587, 31.0218, 0.88, "Vodacom", -53], // Durban - strong
  [-29.9, 31.0, 0.35, "MTN", -98], // Durban area - weak
  [-29.82, 31.05, 0.68, "Telkom", -74], // Durban area - medium

  // Pretoria signals
  [-25.7479, 28.2293, 0.82, "MTN", -56], // Pretoria - strong
  [-25.78, 28.25, 0.45, "Vodacom", -90], // Pretoria area - weak

  // Port Elizabeth signals
  [-33.9608, 25.6022, 0.78, "Vodacom", -60], // Port Elizabeth - strong
  [-33.98, 25.65, 0.5, "MTN", -85], // Port Elizabeth area - medium

  // Bloemfontein signals
  [-29.0852, 26.1596, 0.72, "Cell C", -68], // Bloemfontein - medium
  [-29.12, 26.18, 0.38, "Vodacom", -92], // Bloemfontein area - weak

  // Additional signals across South Africa
  [-28.7406, 24.772, 0.6, "MTN", -80], // Kimberley - medium
  [-31.6169, 29.5552, 0.55, "Vodacom", -82], // East London - medium
  [-23.8965, 29.4486, 0.7, "Cell C", -72], // Polokwane - medium
  [-27.7692, 30.7916, 0.65, "MTN", -75], // Newcastle - medium
  [-32.9833, 27.8667, 0.45, "Vodacom", -88], // King William's Town - weak
  [-25.4214, 30.984, 0.8, "MTN", -57], // Nelspruit - strong
  [-28.4575, 21.2425, 0.4, "Cell C", -93], // Upington - weak
  [-34.1833, 22.1333, 0.75, "Vodacom", -70], // George - medium
];

// Create heat layer
var heatLayer = L.heatLayer(
  signalData.map((point) => [point[0], point[1], point[2]]),
  {
    radius: 20,
    blur: 15,
    maxZoom: 17,
    gradient: {
      0.3: "blue",
      0.6: "yellow",
      1: "red",
    },
  }
).addTo(map);

// Markers array
var markers = [];

// Function to clear markers
function clearMarkers() {
  markers.forEach((m) => map.removeLayer(m.marker));
  markers = [];
}

// Function to add pulsating markers based on filtered data
function addPulsatingMarkers(filteredData) {
  clearMarkers();
  filteredData.forEach(function (point) {
    var color = point[2] > 0.8 ? "red" : point[2] > 0.5 ? "orange" : "blue";
    var marker = L.marker([point[0], point[1]], {
      icon: L.divIcon({
        className: "pulsating-marker",
        html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; 
                       animation: pulse 2s infinite; box-shadow: 0 0 0 0 ${color};"></div>`,
        iconSize: [16, 16],
      }),
    }).addTo(map);

    marker.bindPopup(`
            <div style="text-align: center; min-width: 180px;">
                <b style="color: ${color}; font-size: 16px;">${point[3]}</b><br>
                <div style="margin: 8px 0;">
                    <span style="font-weight: bold;">Strength:</span> ${
                      point[4]
                    } dBm<br>
                    <span style="font-weight: bold;">Quality:</span> ${
                      point[2] > 0.8
                        ? "Excellent"
                        : point[2] > 0.5
                        ? "Good"
                        : "Poor"
                    }
                </div>
                <div style="width: 100%; height: 8px; background: #eee; border-radius: 4px; margin: 8px 0;">
                    <div style="width: ${
                      point[2] * 100
                    }%; height: 100%; background: ${color}; border-radius: 4px;"></div>
                </div>
                <div style="font-size: 12px; color: #666;">
                    Coordinates: ${point[0].toFixed(4)}, ${point[1].toFixed(4)}
                </div>
            </div>
        `);

    markers.push({
      marker: marker,
      carrier: point[3],
      strength: point[2],
    });
  });
}

// Function to apply filters
function applyFilters() {
  var carrier = document.getElementById("carrier-select").value;
  var signal = document.getElementById("signal-filter").value;

  var filteredData = signalData.filter((point) => {
    var carrierMatch = carrier === "all" || point[3] === carrier;
    var signalMatch = true;
    if (signal === "strong") signalMatch = point[2] > 0.8;
    else if (signal === "medium")
      signalMatch = point[2] > 0.5 && point[2] <= 0.8;
    else if (signal === "weak") signalMatch = point[2] <= 0.5;
    return carrierMatch && signalMatch;
  });

  heatLayer.setLatLngs(
    filteredData.map((point) => [point[0], point[1], point[2]])
  );
  addPulsatingMarkers(filteredData);
  updateCounters(filteredData);
  updateCarrierSummary(filteredData);
}

// Generate report function (now downloads CSV)
function generateReport() {
  var carrier = document.getElementById("carrier-select").value;
  var signal = document.getElementById("signal-filter").value;
  var filteredData = signalData.filter((point) => {
    var carrierMatch = carrier === "all" || point[3] === carrier;
    var signalMatch = true;
    if (signal === "strong") signalMatch = point[2] > 0.8;
    else if (signal === "medium")
      signalMatch = point[2] > 0.5 && point[2] <= 0.8;
    else if (signal === "weak") signalMatch = point[2] <= 0.5;
    return carrierMatch && signalMatch;
  });

  // Create CSV content
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Latitude,Longitude,Strength,Carrier,dBm\n";
  filteredData.forEach((point) => {
    csvContent += `${point[0]},${point[1]},${point[2]},${point[3]},${point[4]}\n`;
  });

  // Add summary stats to CSV
  csvContent += "\nSummary Stats\n";
  csvContent += "Carrier,Avg dBm,Coverage %,Weak Areas\n";
  const carriers = ["Vodacom", "MTN", "Cell C", "Telkom"];
  carriers.forEach((c) => {
    const carrierData = filteredData.filter((p) => p[3] === c);
    if (carrierData.length > 0) {
      const avgDbm = (
        carrierData.reduce((sum, p) => sum + p[4], 0) / carrierData.length
      ).toFixed(2);
      const coverage = Math.min(
        100,
        (carrierData.reduce((sum, p) => sum + (p[2] > 0.5 ? 1 : 0.5), 0) /
          carrierData.length) *
          100
      ).toFixed(0);
      const weakCount = carrierData.filter((p) => p[2] <= 0.5).length;
      csvContent += `${c},${avgDbm},${coverage},${weakCount}\n`;
    }
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "signal_report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Simulate live data update
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

  signalData.push([lat, lng, strength, carrier, dBm]);
  applyFilters(); // Reapply filters after update
}

// Play trend simulation (adds 5 points over time)
let simulationInterval;
function playTrendSimulation() {
  if (simulationInterval) clearInterval(simulationInterval);
  let count = 0;
  simulationInterval = setInterval(() => {
    if (count >= 5) clearInterval(simulationInterval);
    simulateLiveUpdate();
    count++;
  }, 1000);
}

// Update signal counters
function updateCounters(filteredData) {
  var strongCount = filteredData.filter((point) => point[2] > 0.8).length;
  var mediumCount = filteredData.filter(
    (point) => point[2] > 0.5 && point[2] <= 0.8
  ).length;
  var weakCount = filteredData.filter((point) => point[2] <= 0.5).length;
  var problemCount = filteredData.filter((point) => point[4] < -90).length; // Weak below -90 dBm

  document.getElementById("strong-count").textContent = strongCount;
  document.getElementById("medium-count").textContent = mediumCount;
  document.getElementById("weak-count").textContent = weakCount;
  document.getElementById("problem-count").textContent = problemCount;

  var coverage = Math.min(
    100,
    Math.floor(
      (100 * (strongCount * 1 + mediumCount * 0.7 + weakCount * 0.3)) /
        filteredData.length
    )
  );
  document.getElementById("total-coverage").textContent =
    (isNaN(coverage) ? 0 : coverage) + "%";
}

// Update carrier summary table
function updateCarrierSummary(filteredData) {
  const tableBody = document.getElementById("carrier-table-body");
  tableBody.innerHTML = "";
  const carriers = ["Vodacom", "MTN", "Cell C", "Telkom"];
  carriers.forEach((carrier) => {
    const carrierData = filteredData.filter((point) => point[3] === carrier);
    if (carrierData.length > 0) {
      const avgDbm = (
        carrierData.reduce((sum, point) => sum + point[4], 0) /
        carrierData.length
      ).toFixed(2);
      const coverage = Math.min(
        100,
        (carrierData.reduce(
          (sum, point) => sum + (point[2] > 0.5 ? 1 : 0.5),
          0
        ) /
          carrierData.length) *
          100
      ).toFixed(0);
      const weakCount = carrierData.filter((point) => point[2] <= 0.5).length;
      const row = `<tr><td>${carrier}</td><td>${avgDbm}</td><td>${coverage}%</td><td>${weakCount}</td></tr>`;
      tableBody.innerHTML += row;
    }
  });
}

// Toggle pulsing effects
function togglePulsing() {
  var markerDivs = document.querySelectorAll(".pulsating-marker div");
  var legendItems = document.querySelectorAll(".signal-color");

  markerDivs.forEach((item) => {
    item.style.animationPlayState =
      item.style.animationPlayState === "paused" ? "running" : "paused";
  });

  legendItems.forEach((item) => {
    item.style.animationPlayState =
      item.style.animationPlayState === "paused" ? "running" : "paused";
  });
}

// Location search (simple coord or city zoom, case-insensitive)
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
    // Simple city mapping (keys in lowercase)
    const cities = {
      "cape town": [-33.9249, 18.4241],
      johannesburg: [-26.2041, 28.0473],
      durban: [-29.8587, 31.0218],
      pretoria: [-25.7479, 28.2293],
      "port elizabeth": [-33.9608, 25.6022],
      bloemfontein: [-29.0852, 26.1596],
      kimberley: [-28.7406, 24.772],
      "east london": [-32.9833, 27.8667], // Corrected to actual East London coords
      polokwane: [-23.8965, 29.4486],
      newcastle: [-27.7692, 30.7916],
      nelspruit: [-25.4214, 30.984],
      upington: [-28.4575, 21.2425],
      george: [-34.1833, 22.1333],
    };
    [lat, lng] = cities[input] || [-30, 25]; // Default if not found
  }

  map.setView([lat, lng], 10);
}

// Initialize when document is ready
document.addEventListener("DOMContentLoaded", function () {
  addPulsatingMarkers(signalData);
  updateCounters(signalData);
  updateCarrierSummary(signalData);

  document
    .getElementById("report-btn")
    .addEventListener("click", generateReport);
  document
    .getElementById("simulate-update")
    .addEventListener("click", simulateLiveUpdate);
  document
    .getElementById("play-simulation")
    .addEventListener("click", playTrendSimulation);
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

// Add CSS for pulsating markers
var style = document.createElement("style");
style.textContent = `
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
    }
`;
document.head.appendChild(style);
