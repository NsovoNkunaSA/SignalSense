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
var filteredLocation = null; // Track the currently filtered location
var filteredCityRadius = 0.5; // Radius in degrees for filtering (adjust as needed, ~50km)

// Function to calculate distance between two lat/lng points (Haversine formula)
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function updatePlanning() {
  // Clear existing markers
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];

  // Filter signalData based on filteredLocation
  let filteredData = signalData;
  if (filteredLocation) {
    filteredData = signalData.filter((p) => {
      const distance = getDistance(
        p[0],
        p[1],
        filteredLocation.lat,
        filteredLocation.lng
      );
      return distance <= filteredCityRadius * 111; // Convert degrees to km (1 degree ≈ 111 km)
    });
  }

  // Update heat layer with filtered data
  map.removeLayer(heatLayer);
  heatLayer = L.heatLayer(
    filteredData.map((p) => [p[0], p[1], p[2]]),
    {
      radius: 20,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.3: "blue", 0.6: "yellow", 1: "red" },
    }
  ).addTo(map);

  // Add pulsating markers for filtered data
  addPulsatingMarkers(map, markers, filteredData);

  // Update stats based on filtered data
  var stats = updateCounters(filteredData);
  document.getElementById("revenue-loss").textContent = "$" + stats.revenueLoss;
  document.getElementById("health-score").textContent =
    stats.healthScore + "/100";
}

function suggestTowers() {
  // Filter weak points (signal strength <= 0.5) within the filtered location
  let weakPoints = signalData.filter((p) => p[2] <= 0.5);
  if (filteredLocation) {
    weakPoints = weakPoints.filter((p) => {
      const distance = getDistance(
        p[0],
        p[1],
        filteredLocation.lat,
        filteredLocation.lng
      );
      return distance <= filteredCityRadius * 111; // Filter by proximity
    });
  }

  if (weakPoints.length === 0) {
    return alert("No weak areas found in the selected region.");
  }

  // Calculate the average location of weak points
  var avgLat = weakPoints.reduce((sum, p) => sum + p[0], 0) / weakPoints.length;
  var avgLng = weakPoints.reduce((sum, p) => sum + p[1], 0) / weakPoints.length;

  // Add a marker for the suggested tower
  L.marker([avgLat, avgLng], {
    icon: L.divIcon({
      className: "suggest-marker",
      html: '<div style="background: green; width: 20px; height: 20px; border-radius: 50%;">🗼</div>',
    }),
  })
    .addTo(map)
    .bindPopup(
      `Suggested Tower Location: ${avgLat.toFixed(4)}, ${avgLng.toFixed(4)}`
    );

  alert(`Suggested tower at ${avgLat.toFixed(4)}, ${avgLng.toFixed(4)}`);
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

  // Set the filtered location and update the map
  filteredLocation = { lat, lng };
  map.setView([lat, lng], 10);
  updatePlanning(); // Refresh markers, heat layer, and stats for the filtered area
}

document.addEventListener("DOMContentLoaded", () => {
  updatePlanning();
  document
    .getElementById("suggest-towers")
    .addEventListener("click", suggestTowers);
  document
    .getElementById("search-btn")
    .addEventListener("click", searchLocation);
  document.getElementById("calc-roi").addEventListener("click", () => {
    var cost = parseFloat(document.getElementById("invest-cost").value);
    var profit = parseFloat(document.getElementById("net-profit").value);
    if (cost && profit) {
      var roi = ((profit - cost) / cost) * 100;
      document.getElementById("roi-result").textContent = `ROI: ${roi.toFixed(
        2
      )}%`;
    } else {
      document.getElementById("roi-result").textContent =
        "Please enter valid numbers";
    }
  });
});
