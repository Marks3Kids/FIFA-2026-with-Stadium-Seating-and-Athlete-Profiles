export interface FeaturedChurch {
  nameKey: string;
  campus?: string;
  address: string;
  mapUrl: string;
}

export interface ReligiousService {
  cityKey: string;
  countryKey: string;
  protestantMapUrl: string;
  catholicMapUrl: string;
  islamicMapUrl: string;
  synagogueMapUrl: string;
  featuredChurches?: FeaturedChurch[];
}

export const religiousServices: ReligiousService[] = [
  {
    cityKey: "newYork",
    countryKey: "usa",
    protestantMapUrl: "https://www.google.com/maps/search/Protestant+church+near+MetLife+Stadium+New+Jersey",
    catholicMapUrl: "https://www.google.com/maps/search/Catholic+church+near+MetLife+Stadium+New+Jersey",
    islamicMapUrl: "https://www.google.com/maps/search/Mosque+near+MetLife+Stadium+New+Jersey",
    synagogueMapUrl: "https://www.google.com/maps/search/Synagogue+near+MetLife+Stadium+New+Jersey"
  },
  {
    cityKey: "dallas",
    countryKey: "usa",
    protestantMapUrl: "https://www.google.com/maps/search/Protestant+church+in+Dallas+Texas",
    catholicMapUrl: "https://www.google.com/maps/search/Catholic+church+in+Dallas+Texas",
    islamicMapUrl: "https://www.google.com/maps/search/Mosque+in+Dallas+Texas",
    synagogueMapUrl: "https://www.google.com/maps/search/Synagogue+in+Dallas+Texas"
  },
  {
    cityKey: "losAngeles",
    countryKey: "usa",
    protestantMapUrl: "https://www.google.com/maps/search/Protestant+church+in+Los+Angeles+California",
    catholicMapUrl: "https://www.google.com/maps/search/Catholic+church+in+Los+Angeles+California",
    islamicMapUrl: "https://www.google.com/maps/search/Mosque+in+Los+Angeles+California",
    synagogueMapUrl: "https://www.google.com/maps/search/Synagogue+in+Los+Angeles+California"
  },
  {
    cityKey: "atlanta",
    countryKey: "usa",
    protestantMapUrl: "https://www.google.com/maps/search/Protestant+church+in+Atlanta+Georgia",
    catholicMapUrl: "https://www.google.com/maps/search/Catholic+church+in+Atlanta+Georgia",
    islamicMapUrl: "https://www.google.com/maps/search/Mosque+in+Atlanta+Georgia",
    synagogueMapUrl: "https://www.google.com/maps/search/Synagogue+in+Atlanta+Georgia"
  },
  {
    cityKey: "miami",
    countryKey: "usa",
    protestantMapUrl: "https://www.google.com/maps/search/Protestant+church+in+Miami+Florida",
    catholicMapUrl: "https://www.google.com/maps/search/Catholic+church+in+Miami+Florida",
    islamicMapUrl: "https://www.google.com/maps/search/Mosque+in+Miami+Florida",
    synagogueMapUrl: "https://www.google.com/maps/search/Synagogue+in+Miami+Florida"
  },
  {
    cityKey: "sanFrancisco",
    countryKey: "usa",
    protestantMapUrl: "https://www.google.com/maps/search/Protestant+church+in+San+Francisco+California",
    catholicMapUrl: "https://www.google.com/maps/search/Catholic+church+in+San+Francisco+California",
    islamicMapUrl: "https://www.google.com/maps/search/Mosque+in+San+Francisco+California",
    synagogueMapUrl: "https://www.google.com/maps/search/Synagogue+in+San+Francisco+California"
  },
  {
    cityKey: "seattle",
    countryKey: "usa",
    protestantMapUrl: "https://www.google.com/maps/search/Protestant+church+in+Seattle+Washington",
    catholicMapUrl: "https://www.google.com/maps/search/Catholic+church+in+Seattle+Washington",
    islamicMapUrl: "https://www.google.com/maps/search/Mosque+in+Seattle+Washington",
    synagogueMapUrl: "https://www.google.com/maps/search/Synagogue+in+Seattle+Washington"
  },
  {
    cityKey: "houston",
    countryKey: "usa",
    protestantMapUrl: "https://www.google.com/maps/search/Protestant+church+in+Houston+Texas",
    catholicMapUrl: "https://www.google.com/maps/search/Catholic+church+in+Houston+Texas",
    islamicMapUrl: "https://www.google.com/maps/search/Mosque+in+Houston+Texas",
    synagogueMapUrl: "https://www.google.com/maps/search/Synagogue+in+Houston+Texas"
  },
  {
    cityKey: "philadelphia",
    countryKey: "usa",
    protestantMapUrl: "https://www.google.com/maps/search/Protestant+church+in+Philadelphia+Pennsylvania",
    catholicMapUrl: "https://www.google.com/maps/search/Catholic+church+in+Philadelphia+Pennsylvania",
    islamicMapUrl: "https://www.google.com/maps/search/Mosque+in+Philadelphia+Pennsylvania",
    synagogueMapUrl: "https://www.google.com/maps/search/Synagogue+in+Philadelphia+Pennsylvania"
  },
  {
    cityKey: "kansasCity",
    countryKey: "usa",
    protestantMapUrl: "https://www.google.com/maps/search/Protestant+church+in+Kansas+City+Missouri",
    catholicMapUrl: "https://www.google.com/maps/search/Catholic+church+in+Kansas+City+Missouri",
    islamicMapUrl: "https://www.google.com/maps/search/Mosque+in+Kansas+City+Missouri",
    synagogueMapUrl: "https://www.google.com/maps/search/Synagogue+in+Kansas+City+Missouri"
  },
  {
    cityKey: "boston",
    countryKey: "usa",
    protestantMapUrl: "https://www.google.com/maps/search/Protestant+church+in+Boston+Massachusetts",
    catholicMapUrl: "https://www.google.com/maps/search/Catholic+church+in+Boston+Massachusetts",
    islamicMapUrl: "https://www.google.com/maps/search/Mosque+in+Boston+Massachusetts",
    synagogueMapUrl: "https://www.google.com/maps/search/Synagogue+in+Boston+Massachusetts"
  },
  {
    cityKey: "toronto",
    countryKey: "canada",
    protestantMapUrl: "https://www.google.com/maps/search/Protestant+church+in+Toronto+Ontario+Canada",
    catholicMapUrl: "https://www.google.com/maps/search/Catholic+church+in+Toronto+Ontario+Canada",
    islamicMapUrl: "https://www.google.com/maps/search/Mosque+in+Toronto+Ontario+Canada",
    synagogueMapUrl: "https://www.google.com/maps/search/Synagogue+in+Toronto+Ontario+Canada"
  },
  {
    cityKey: "vancouver",
    countryKey: "canada",
    protestantMapUrl: "https://www.google.com/maps/search/Protestant+church+in+Vancouver+British+Columbia+Canada",
    catholicMapUrl: "https://www.google.com/maps/search/Catholic+church+in+Vancouver+British+Columbia+Canada",
    islamicMapUrl: "https://www.google.com/maps/search/Mosque+in+Vancouver+British+Columbia+Canada",
    synagogueMapUrl: "https://www.google.com/maps/search/Synagogue+in+Vancouver+British+Columbia+Canada"
  },
  {
    cityKey: "mexicoCity",
    countryKey: "mexico",
    protestantMapUrl: "https://www.google.com/maps/search/Protestant+church+in+Mexico+City+Mexico",
    catholicMapUrl: "https://www.google.com/maps/search/Catholic+church+in+Mexico+City+Mexico",
    islamicMapUrl: "https://www.google.com/maps/search/Mosque+in+Mexico+City+Mexico",
    synagogueMapUrl: "https://www.google.com/maps/search/Synagogue+in+Mexico+City+Mexico"
  },
  {
    cityKey: "guadalajara",
    countryKey: "mexico",
    protestantMapUrl: "https://www.google.com/maps/search/Protestant+church+in+Guadalajara+Mexico",
    catholicMapUrl: "https://www.google.com/maps/search/Catholic+church+in+Guadalajara+Mexico",
    islamicMapUrl: "https://www.google.com/maps/search/Mosque+in+Guadalajara+Mexico",
    synagogueMapUrl: "https://www.google.com/maps/search/Synagogue+in+Guadalajara+Mexico"
  },
  {
    cityKey: "monterrey",
    countryKey: "mexico",
    protestantMapUrl: "https://www.google.com/maps/search/Protestant+church+in+Monterrey+Mexico",
    catholicMapUrl: "https://www.google.com/maps/search/Catholic+church+in+Monterrey+Mexico",
    islamicMapUrl: "https://www.google.com/maps/search/Mosque+in+Monterrey+Mexico",
    synagogueMapUrl: "https://www.google.com/maps/search/Synagogue+in+Monterrey+Mexico"
  }
];
