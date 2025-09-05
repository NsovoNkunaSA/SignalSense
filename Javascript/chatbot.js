function initializeChatbot() {
  const chatWindow = document.getElementById("chat-window");
  const chatInput = document.getElementById("chat-input");
  const chatSend = document.getElementById("chat-send");
  const chatbot = document.getElementById("chatbot");
  const chatToggle = document.getElementById("chat-toggle");

  // Hide chatbot by default
  chatbot.style.display = "none";

  // Toggle chatbot visibility
  chatToggle.addEventListener("click", () => {
    chatbot.style.display = chatbot.style.display === "none" ? "flex" : "none";
    if (chatbot.style.display === "flex") {
      addMessage(
        "bot",
        "Hi! I’m SignalSense Assistant. Ask me about signal data, analytics, or how to use the dashboard!"
      );
    }
  });

  chatSend.addEventListener("click", handleUserInput);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleUserInput();
  });

  function addMessage(sender, text) {
    const message = document.createElement("p");
    message.className = `${sender}-message`;
    message.textContent = text;
    chatWindow.appendChild(message);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function handleUserInput() {
    const input = chatInput.value.trim().toLowerCase();
    if (!input) return;

    addMessage("user", input);
    chatInput.value = "";

    let response = processInput(input);
    addMessage("bot", response);
  }

  function processInput(input) {
    if (input.includes("help") || input.includes("what can you do")) {
      return 'I can help with: \n- Signal stats (e.g., "What’s MTN’s average signal?" or "Where are weak signals?")\n- Dashboard usage (e.g., "How do I filter signals?")\n- Planning tools (e.g., "How do I suggest towers?")\n- General stats (e.g., "What’s total coverage?")';
    }

    if (input.includes("filter") || input.includes("carrier select")) {
      return 'Use the "Carrier Selection" dropdown to filter by carriers like Vodacom or MTN. The "Signal Filter" dropdown lets you view strong, medium, or weak signals. Try selecting one to update the map!';
    }
    if (input.includes("search") || input.includes("location")) {
      return 'Enter a city (e.g., "Cape Town") or coordinates (e.g., "-33.9249,18.4241") in the location search box, then click "Search" to zoom the map to that area.';
    }
    if (input.includes("report") || input.includes("generate report")) {
      return 'Click the "Generate Report" button on the Dashboard page to download a CSV of filtered signal data, including latitude, longitude, strength, and more.';
    }
    if (input.includes("simulate update")) {
      return 'Click "Simulate Update" on the Dashboard to add a random signal data point to the map, mimicking real-time updates.';
    }
    if (input.includes("toggle pulsing")) {
      return 'The "Toggle Pulsing" button pauses or resumes the pulsing animation of signal markers on the map.';
    }

    if (input.includes("average signal") || input.includes("avg dbm")) {
      const carriers = ["Vodacom", "MTN", "Cell C", "Telkom"];
      let targetCarrier = carriers.find((c) => input.includes(c.toLowerCase()));
      if (targetCarrier) {
        const carrierData = signalData.filter((p) => p[3] === targetCarrier);
        if (carrierData.length > 0) {
          const avgDbm = (
            carrierData.reduce((sum, p) => sum + p[4], 0) / carrierData.length
          ).toFixed(2);
          return `${targetCarrier}'s average signal strength: ${avgDbm} dBm`;
        }
        return `No data available for ${targetCarrier}.`;
      }
      let response = "Average signal strength (dBm):\n";
      carriers.forEach((carrier) => {
        const carrierData = signalData.filter((p) => p[3] === carrier);
        if (carrierData.length > 0) {
          const avgDbm = (
            carrierData.reduce((sum, p) => sum + p[4], 0) / carrierData.length
          ).toFixed(2);
          response += `${carrier}: ${avgDbm} dBm\n`;
        }
      });
      return response;
    }
    if (input.includes("weak signals") || input.includes("where are weak")) {
      const weakPoints = signalData.filter((p) => p[2] <= 0.5);
      if (weakPoints.length > 0) {
        const locations = weakPoints
          .map((p) => `${p[0].toFixed(4)}, ${p[1].toFixed(4)} (${p[3]})`)
          .join("\n");
        return `There are ${weakPoints.length} weak signal points (strength ≤ 0.5):\n${locations}\nCheck Planning to suggest towers.`;
      }
      return "No weak signals found in the data.";
    }
    if (input.includes("coverage") || input.includes("total coverage")) {
      const stats = updateCounters(signalData);
      return `Total coverage: ${stats.coverage}%`;
    }
    if (input.includes("suggest towers") || input.includes("new tower")) {
      return 'On the Planning page, click "Suggest New Towers" to propose a tower location based on weak signal areas. Filter by location first for better results.';
    }
    if (input.includes("roi") || input.includes("calculate roi")) {
      return 'On the Planning page, enter the investment cost and expected net profit in the ROI Calculator, then click "Calculate ROI" to see the return on investment percentage.';
    }

    return 'Sorry, I didn’t understand that. Try asking about signal data (e.g., "What’s MTN’s average signal?"), dashboard features (e.g., "How do I filter?"), or planning (e.g., "How do I suggest towers?").';
  }
}

document.addEventListener("DOMContentLoaded", initializeChatbot);
