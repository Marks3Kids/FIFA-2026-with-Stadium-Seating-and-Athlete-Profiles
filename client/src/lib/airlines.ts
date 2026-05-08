export const airlineUrls: Record<string, string> = {
  // US Major Airlines
  "Delta": "https://www.delta.com",
  "United": "https://www.united.com",
  "American": "https://www.aa.com",
  "JetBlue": "https://www.jetblue.com",
  "Southwest": "https://www.southwest.com",
  "Spirit": "https://www.spirit.com",
  "Frontier": "https://www.flyfrontier.com",
  "Alaska Airlines": "https://www.alaskaair.com",
  
  // European Airlines
  "British Airways": "https://www.britishairways.com",
  "Lufthansa": "https://www.lufthansa.com",
  "Air France": "https://www.airfrance.com",
  "KLM": "https://www.klm.com",
  "Iberia": "https://www.iberia.com",
  "Aer Lingus": "https://www.aerlingus.com",
  "Icelandair": "https://www.icelandair.com",
  "Turkish Airlines": "https://www.turkishairlines.com",
  
  // Middle East Airlines
  "Emirates": "https://www.emirates.com",
  "Qatar Airways": "https://www.qatarairways.com",
  
  // Asia Pacific Airlines
  "Singapore Airlines": "https://www.singaporeair.com",
  "Cathay Pacific": "https://www.cathaypacific.com",
  "ANA": "https://www.ana.co.jp/en/us/",
  "Japan Airlines": "https://www.jal.co.jp/en/",
  "Korean Air": "https://www.koreanair.com",
  "Qantas": "https://www.qantas.com",
  "Air New Zealand": "https://www.airnewzealand.com",
  "Air China": "https://www.airchina.com",
  
  // Latin American Airlines
  "LATAM": "https://www.latam.com",
  "Avianca": "https://www.avianca.com",
  "Copa Airlines": "https://www.copaair.com",
  "Aeroméxico": "https://www.aeromexico.com",
  "Volaris": "https://www.volaris.com",
  "VivaAerobus": "https://www.vivaaerobus.com",
  
  // Canadian Airlines
  "Air Canada": "https://www.aircanada.com",
  "WestJet": "https://www.westjet.com",
  "Porter Airlines": "https://www.flyporter.com",
};

export const getAirlineUrl = (airline: string): string | null => {
  return airlineUrls[airline] || null;
};