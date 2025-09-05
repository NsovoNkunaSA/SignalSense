// Shared signal data and history
var signalData = [
  [-33.9249, 18.4241, 0.9, "Vodacom", -52, 25, 40, 0], // Cape Town - strong
  [-33.95, 18.45, 0.3, "MTN", -105, 5, 150, 5], // Cape Town - weak
  [-34.0, 18.5, 0.7, "Vodacom", -72, 15, 80, 2], // Cape Town - medium
  [-33.93, 18.42, 0.85, "MTN", -58, 22, 45, 1], // Cape Town - strong
  [-33.91, 18.41, 0.65, "Vodacom", -75, 14, 85, 2.5], // Cape Town - medium
  [-26.2041, 28.0473, 0.8, "MTN", -55, 20, 50, 1], // Johannesburg - strong
  [-26.15, 28.1, 0.4, "Vodacom", -95, 8, 120, 4], // Johannesburg - weak
  [-26.25, 28.0, 0.75, "Cell C", -70, 16, 75, 1.5], // Johannesburg - medium
  [-29.8587, 31.0218, 0.88, "Vodacom", -53, 24, 42, 0.5], // Durban - strong
  [-29.9, 31.0, 0.35, "MTN", -98, 6, 140, 4.5], // Durban - weak
  [-29.82, 31.05, 0.68, "Telkom", -74, 15, 80, 2], // Durban - medium
  [-25.7479, 28.2293, 0.82, "MTN", -56, 21, 48, 1], // Pretoria - strong
  [-25.78, 28.25, 0.45, "Vodacom", -90, 9, 110, 3.5], // Pretoria - weak
  [-33.9608, 25.6022, 0.78, "Vodacom", -60, 18, 55, 1.2], // Port Elizabeth - strong
  [-33.98, 25.65, 0.5, "MTN", -85, 10, 100, 3], // Port Elizabeth - medium
  [-29.0852, 26.1596, 0.72, "Cell C", -68, 16, 70, 1.8], // Bloemfontein - medium
  [-29.12, 26.18, 0.38, "Vodacom", -92, 7, 130, 4], // Bloemfontein - weak
  [-28.7406, 24.772, 0.6, "MTN", -80, 12, 90, 2.5], // Kimberley - medium
  [-31.6169, 29.5552, 0.55, "Vodacom", -82, 11, 95, 2.8], // East London - medium
  [-23.8965, 29.4486, 0.7, "Cell C", -72, 15, 80, 2], // Polokwane - medium
  [-27.7692, 30.7916, 0.65, "MTN", -75, 14, 85, 2.2], // Newcastle - medium
  [-32.9833, 27.8667, 0.45, "Vodacom", -88, 9, 110, 3.5], // King William's Town - weak
  [-25.4214, 30.984, 0.8, "MTN", -57, 20, 50, 1], // Nelspruit - strong
  [-28.4575, 21.2425, 0.4, "Cell C", -93, 8, 120, 4], // Upington - weak
  [-34.1833, 22.1333, 0.75, "Vodacom", -70, 16, 75, 1.5], // George - medium
];
var history = []; // {timestamp, coverage}
