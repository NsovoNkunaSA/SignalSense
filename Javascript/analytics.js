function updateAnalytics() {
  var stats = updateCounters(signalData);
  document.getElementById("avg-dbm").textContent = stats.avgDbm;
  document.getElementById("avg-throughput").textContent = stats.avgThroughput;
  document.getElementById("avg-latency").textContent = stats.avgLatency;
  document.getElementById("packet-loss").textContent = stats.packetLoss + "%";

  const tableBody = document.getElementById("carrier-table-body");
  tableBody.innerHTML = "";
  const carriers = ["Vodacom", "MTN", "Cell C", "Telkom"];
  let chartData = {
    labels: [],
    datasets: [
      { label: "Avg dBm", data: [], backgroundColor: "rgba(39,60,117,0.7)" },
    ],
  };
  carriers.forEach((carrier) => {
    const carrierData = signalData.filter((p) => p[3] === carrier);
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
      tableBody.innerHTML += `<tr><td>${carrier}</td><td>${avgDbm}</td><td>${coverage}%</td><td>${weakCount}</td></tr>`;
      chartData.labels.push(carrier);
      chartData.datasets[0].data.push(avgDbm);
    }
  });

  var ctx = document.getElementById("carrier-chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: chartData,
    options: { scales: { y: { beginAtZero: false } } },
  });

  var trendCtx = document.getElementById("trend-chart").getContext("2d");
  new Chart(trendCtx, {
    type: "line",
    data: {
      labels: history.map((h) => new Date(h.timestamp).toLocaleTimeString()),
      datasets: [
        {
          label: "Coverage %",
          data: history.map((h) => h.coverage),
          borderColor: "#273c75",
          fill: false,
        },
      ],
    },
    options: { scales: { y: { beginAtZero: true, max: 100 } } },
  });
}

document.addEventListener("DOMContentLoaded", updateAnalytics);
