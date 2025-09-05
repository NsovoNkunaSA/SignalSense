function clearMarkers(map, markers) {
  markers.forEach((m) => map.removeLayer(m.marker));
  markers.length = 0;
}

function addPulsatingMarkers(map, markers, filteredData) {
  clearMarkers(map, markers);
  filteredData.forEach((point) => {
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
          <span style="font-weight: bold;">Strength:</span> ${point[4]} dBm<br>
          <span style="font-weight: bold;">Quality:</span> ${
            point[2] > 0.8 ? "Excellent" : point[2] > 0.5 ? "Good" : "Poor"
          }<br>
          <span style="font-weight: bold;">Throughput:</span> ${
            point[5]
          } Mbps<br>
          <span style="font-weight: bold;">Latency:</span> ${point[6]} ms<br>
          <span style="font-weight: bold;">Packet Loss:</span> ${point[7]}%
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
    markers.push({ marker, carrier: point[3], strength: point[2] });
  });
}

function updateCounters(filteredData) {
  var strongCount = filteredData.filter((p) => p[2] > 0.8).length;
  var mediumCount = filteredData.filter(
    (p) => p[2] > 0.5 && p[2] <= 0.8
  ).length;
  var weakCount = filteredData.filter((p) => p[2] <= 0.5).length;
  var problemCount = filteredData.filter((p) => p[4] < -90).length;
  var coverage = Math.min(
    100,
    Math.floor(
      (100 * (strongCount * 1 + mediumCount * 0.7 + weakCount * 0.3)) /
        filteredData.length
    )
  );
  var avgDbm = (
    filteredData.reduce((sum, p) => sum + p[4], 0) / filteredData.length || 0
  ).toFixed(2);
  var avgThroughput = (
    filteredData.reduce((sum, p) => sum + p[5], 0) / filteredData.length || 0
  ).toFixed(2);
  var avgLatency = (
    filteredData.reduce((sum, p) => sum + p[6], 0) / filteredData.length || 0
  ).toFixed(2);
  var packetLoss = (
    filteredData.reduce((sum, p) => sum + p[7], 0) / filteredData.length || 0
  ).toFixed(2);
  var revenueLoss = weakCount * 100; // $100 per weak signal
  var healthScore = Math.min(100, coverage - weakCount * 5);

  return {
    strongCount,
    mediumCount,
    weakCount,
    problemCount,
    coverage,
    avgDbm,
    avgThroughput,
    avgLatency,
    packetLoss,
    revenueLoss,
    healthScore,
  };
}
