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

// Add markers for each point with pulsating effects
var markers = [];
function addPulsatingMarkers() {
  signalData.forEach(function (point) {
    // Determine marker color based on signal strength
    var color;
    if (point[2] > 0.8) color = "red";
    else if (point[2] > 0.5) color = "orange";
    else color = "blue";

    // Create marker with custom pulsating icon
    var marker = L.marker([point[0], point[1]], {
      icon: L.divIcon({
        className: "pulsating-marker",
        html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; 
                       animation: pulse 2s infinite; box-shadow: 0 0 0 0 ${color};"></div>`,
        iconSize: [16, 16],
      }),
    }).addTo(map);

    // Bind popup with signal information
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

    // Store marker reference
    markers.push({
      marker: marker,
      carrier: point[3],
      strength: point[2],
    });
  });
}

// Generate report function
function generateReport() {
  // In a real application, this would generate a detailed report
  alert(
    "📑 Generating comprehensive signal strength report...\n\nThis would include:\n- Coverage statistics\n- Signal strength distribution\n- Problem areas identified\n- Carrier comparison data"
  );

  // Simulate report generation
  setTimeout(function () {
    alert(
      "Report generated successfully! Download would start automatically in a real application."
    );
  }, 1500);
}

// Simulate live data update
function simulateLiveUpdate() {
  // Add a new random signal point somewhere in Southern Africa
  var lat = -30 + (Math.random() - 0.5) * 10; // Wider range
  var lng = 25 + (Math.random() - 0.5) * 10; // Wider range
  var strength = Math.random();
  var carriers = ["Vodacom", "MTN", "Cell C", "Telkom"];
  var carrier = carriers[Math.floor(Math.random() * carriers.length)];
  var dBm =
    strength > 0.8
      ? -50 - Math.random() * 10
      : strength > 0.5
      ? -70 - Math.random() * 20
      : -90 - Math.random() * 30;

  // Add to heat layer
  signalData.push([lat, lng, strength, carrier, dBm]);
  heatLayer.setData(signalData.map((point) => [point[0], point[1], point[2]]));

  // Add marker
  var color = strength > 0.8 ? "red" : strength > 0.5 ? "orange" : "blue";
  var marker = L.marker([lat, lng], {
    icon: L.divIcon({
      className: "pulsating-marker",
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; 
                   animation: pulse 2s infinite; box-shadow: 0 0 0 0 ${color};"></div>`,
      iconSize: [16, 16],
    }),
  }).addTo(map);

  marker.bindPopup(`
        <div style="text-align: center; min-width: 180px;">
            <b style="color: ${color}; font-size: 16px;">${carrier}</b><br>
            <div style="margin: 8px 0;">
                <span style="font-weight: bold;">Strength:</span> ${dBm.toFixed(
                  2
                )} dBm<br>
                <span style="font-weight: bold;">Quality:</span> ${
                  strength > 0.8
                    ? "Excellent"
                    : strength > 0.5
                    ? "Good"
                    : "Poor"
                }
            </div>
            <div style="width: 100%; height: 8px; background: #eee; border-radius: 4px; margin: 8px 0;">
                <div style="width: ${
                  strength * 100
                }%; height: 100%; background: ${color}; border-radius: 4px;"></div>
            </div>
            <div style="font-size: 12px; color: #666;">
                Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}
            </div>
        </div>
    `);

  markers.push({
    marker: marker,
    carrier: carrier,
    strength: strength,
  });

  // Update counters
  updateCounters();

  alert(
    `Live update simulated! New ${carrier} signal point added at ${lat.toFixed(
      4
    )}, ${lng.toFixed(4)}`
  );
}

// Update signal counters
function updateCounters() {
  var strongCount = signalData.filter((point) => point[2] > 0.8).length;
  var mediumCount = signalData.filter(
    (point) => point[2] > 0.5 && point[2] <= 0.8
  ).length;
  var weakCount = signalData.filter((point) => point[2] <= 0.5).length;

  document.getElementById("strong-count").textContent = strongCount;
  document.getElementById("medium-count").textContent = mediumCount;
  document.getElementById("weak-count").textContent = weakCount;

  // Calculate "coverage" (just for demonstration)
  var coverage = Math.min(
    100,
    Math.floor(
      (100 * (strongCount * 1 + mediumCount * 0.7 + weakCount * 0.3)) /
        signalData.length
    )
  );
  document.getElementById("total-coverage").textContent = coverage + "%";
}

// Toggle pulsing effects
function togglePulsing() {
  var markers = document.querySelectorAll(".pulsating-marker div");
  var legendItems = document.querySelectorAll(".signal-color");

  markers.forEach((marker) => {
    if (marker.style.animationPlayState === "paused") {
      marker.style.animationPlayState = "running";
    } else {
      marker.style.animationPlayState = "paused";
    }
  });

  legendItems.forEach((item) => {
    if (item.style.animationPlayState === "paused") {
      item.style.animationPlayState = "running";
    } else {
      item.style.animationPlayState = "paused";
    }
  });

  alert("Pulsating effects toggled!");
}

// Initialize when document is ready
document.addEventListener("DOMContentLoaded", function () {
  // Add pulsating markers to the map
  addPulsatingMarkers();

  // Initialize counters
  updateCounters();

  // Add event listeners
  document
    .getElementById("report-btn")
    .addEventListener("click", generateReport);
  document
    .getElementById("simulate-update")
    .addEventListener("click", simulateLiveUpdate);
  document
    .getElementById("toggle-pulsing")
    .addEventListener("click", togglePulsing);

  // Filter event listeners
  document
    .getElementById("carrier-select")
    .addEventListener("change", function (e) {
      // In a real application, this would filter the data
      alert(`Filtering by carrier: ${e.target.value}`);
    });

  document
    .getElementById("signal-filter")
    .addEventListener("change", function (e) {
      // In a real application, this would filter the data
      alert(`Filtering by signal strength: ${e.target.value}`);
    });
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
