import { Layout } from "@/components/Layout";
import { Utensils, ArrowLeft, MapPin, DollarSign, ChevronRight, ExternalLink, Star } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import diningHeroImage from "@assets/generated_images/panoramic_diverse_restaurant_diners.png";

interface Restaurant {
  name: string;
  cuisine: string;
  priceRange: string;
  neighborhood: string;
  description: string;
  website: string;
  rating?: number;
}

interface PriceCategory {
  category: string;
  priceRange: string;
  color: string;
  bgColor: string;
  restaurants: Restaurant[];
}

interface CityDining {
  city: string;
  cityKey: string;
  country: string;
  countryKey: string;
  countryCode: string;
  categories: PriceCategory[];
}

const diningData: CityDining[] = [
  {
    city: "New York / New Jersey",
    cityKey: "newYork",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$10-25 USD",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        restaurants: [
          { name: "Joe's Pizza", cuisine: "Pizza", priceRange: "$", neighborhood: "Greenwich Village", description: "Iconic NYC slice shop since 1975", website: "https://www.joespizzanyc.com" },
          { name: "Xi'an Famous Foods", cuisine: "Chinese", priceRange: "$", neighborhood: "Multiple locations", description: "Hand-pulled noodles and cumin lamb", website: "https://www.xianfoods.com" },
          { name: "Los Tacos No.1", cuisine: "Mexican", priceRange: "$", neighborhood: "Chelsea Market", description: "Authentic Mexican street tacos", website: "https://www.lostacos1.com" },
          { name: "Mamoun's Falafel", cuisine: "Middle Eastern", priceRange: "$", neighborhood: "Greenwich Village", description: "NYC's oldest falafel restaurant", website: "https://www.mamouns.com" },
          { name: "Halal Guys", cuisine: "Middle Eastern", priceRange: "$", neighborhood: "Midtown", description: "Famous street cart chicken and gyro", website: "https://www.thehalalguys.com" },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$25-50 USD",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        restaurants: [
          { name: "Carbone", cuisine: "Italian-American", priceRange: "$$", neighborhood: "Greenwich Village", description: "Classic Italian-American in retro setting", website: "https://www.carbonenewyork.com" },
          { name: "Balthazar", cuisine: "French Bistro", priceRange: "$$", neighborhood: "SoHo", description: "Iconic French brasserie", website: "https://www.balthazarny.com" },
          { name: "Katz's Delicatessen", cuisine: "Jewish Deli", priceRange: "$$", neighborhood: "Lower East Side", description: "Legendary pastrami since 1888", website: "https://www.katzsdelicatessen.com" },
          { name: "Peter Luger", cuisine: "Steakhouse", priceRange: "$$", neighborhood: "Brooklyn", description: "Brooklyn's famous steakhouse since 1887", website: "https://www.peterluger.com" },
          { name: "L'Artusi", cuisine: "Italian", priceRange: "$$", neighborhood: "West Village", description: "Modern Italian with great pasta", website: "https://www.lartusi.com" },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$50-100 USD",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        restaurants: [
          { name: "Gramercy Tavern", cuisine: "American", priceRange: "$$$", neighborhood: "Gramercy", description: "Farm-to-table fine dining", website: "https://www.gramercytavern.com" },
          { name: "The Spotted Pig", cuisine: "Gastropub", priceRange: "$$$", neighborhood: "West Village", description: "Upscale British-Italian gastropub", website: "https://www.thespottedpig.com" },
          { name: "Momofuku Ko", cuisine: "Asian Fusion", priceRange: "$$$", neighborhood: "East Village", description: "David Chang's tasting menu restaurant", website: "https://www.ko.momofuku.com" },
          { name: "The NoMad", cuisine: "American", priceRange: "$$$", neighborhood: "NoMad", description: "Elegant dining in historic hotel", website: "https://www.thenomadhotel.com" },
          { name: "Cosme", cuisine: "Mexican", priceRange: "$$$", neighborhood: "Flatiron", description: "Elevated Mexican by Enrique Olvera", website: "https://www.cosmenyc.com" },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$100+ USD",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        restaurants: [
          { name: "Eleven Madison Park", cuisine: "American", priceRange: "$$$$", neighborhood: "Flatiron", description: "Three Michelin star tasting menu", website: "https://www.elevenmadisonpark.com" },
          { name: "Le Bernardin", cuisine: "French Seafood", priceRange: "$$$$", neighborhood: "Midtown", description: "World-renowned seafood temple", website: "https://www.le-bernardin.com" },
          { name: "Per Se", cuisine: "French-American", priceRange: "$$$$", neighborhood: "Columbus Circle", description: "Thomas Keller's NYC flagship", website: "https://www.thomaskeller.com/perse" },
          { name: "Masa", cuisine: "Japanese", priceRange: "$$$$", neighborhood: "Columbus Circle", description: "Omakase at its finest", website: "https://www.masanyc.com" },
          { name: "Daniel", cuisine: "French", priceRange: "$$$$", neighborhood: "Upper East Side", description: "Daniel Boulud's flagship restaurant", website: "https://www.danielnyc.com" },
        ]
      }
    ]
  },
  {
    city: "Los Angeles",
    cityKey: "losAngeles",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$10-25 USD",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        restaurants: [
          { name: "In-N-Out Burger", cuisine: "Burgers", priceRange: "$", neighborhood: "Multiple locations", description: "California's iconic burger chain", website: "https://www.in-n-out.com" },
          { name: "Tacos Leo", cuisine: "Mexican", priceRange: "$", neighborhood: "La Brea", description: "Best al pastor tacos in LA", website: "https://www.tacosleo.com" },
          { name: "Howlin' Ray's", cuisine: "Southern", priceRange: "$", neighborhood: "Chinatown", description: "Nashville hot chicken sensation", website: "https://www.howlinrays.com" },
          { name: "Langer's Delicatessen", cuisine: "Jewish Deli", priceRange: "$", neighborhood: "Westlake", description: "LA's best pastrami sandwich", website: "https://www.langersdeli.com" },
          { name: "Grand Central Market", cuisine: "Food Hall", priceRange: "$", neighborhood: "Downtown", description: "Historic food hall with diverse vendors", website: "https://www.grandcentralmarket.com" },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$25-50 USD",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        restaurants: [
          { name: "Gjusta", cuisine: "Bakery/Deli", priceRange: "$$", neighborhood: "Venice", description: "Artisan bakery and deli", website: "https://www.gjusta.com" },
          { name: "Bestia", cuisine: "Italian", priceRange: "$$", neighborhood: "Arts District", description: "Industrial-chic Italian hotspot", website: "https://www.bestiala.com" },
          { name: "Republique", cuisine: "French-Californian", priceRange: "$$", neighborhood: "Mid-Wilshire", description: "All-day dining in historic building", website: "https://www.republiquela.com" },
          { name: "Broken Spanish", cuisine: "Mexican", priceRange: "$$", neighborhood: "Downtown", description: "Modern Mexican fine dining", website: "https://www.brokenspanish.com" },
          { name: "Night + Market", cuisine: "Thai", priceRange: "$$", neighborhood: "Silver Lake", description: "Bold Thai street food", website: "https://www.nightmarketla.com" },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$50-100 USD",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        restaurants: [
          { name: "Spago", cuisine: "Californian", priceRange: "$$$", neighborhood: "Beverly Hills", description: "Wolfgang Puck's flagship", website: "https://www.wolfgangpuck.com/dining/spago" },
          { name: "Providence", cuisine: "Seafood", priceRange: "$$$", neighborhood: "Hollywood", description: "Two Michelin star seafood", website: "https://www.providencela.com" },
          { name: "Osteria Mozza", cuisine: "Italian", priceRange: "$$$", neighborhood: "Hollywood", description: "Nancy Silverton's Italian gem", website: "https://www.osteriamozza.com" },
          { name: "Gjelina", cuisine: "Californian", priceRange: "$$$", neighborhood: "Venice", description: "Rustic California cuisine", website: "https://www.gjelina.com" },
          { name: "The Bazaar by José Andrés", cuisine: "Spanish", priceRange: "$$$", neighborhood: "Beverly Hills", description: "Avant-garde tapas experience", website: "https://www.thebazaar.com" },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$100+ USD",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        restaurants: [
          { name: "n/naka", cuisine: "Japanese Kaiseki", priceRange: "$$$$", neighborhood: "Palms", description: "Two Michelin star kaiseki", website: "https://www.n-naka.com" },
          { name: "Mélisse", cuisine: "French", priceRange: "$$$$", neighborhood: "Santa Monica", description: "Two Michelin star French", website: "https://www.melisse.com" },
          { name: "Vespertine", cuisine: "Avant-garde", priceRange: "$$$$", neighborhood: "Culver City", description: "Otherworldly dining experience", website: "https://www.vespertine.la" },
          { name: "Sushi Ginza Onodera", cuisine: "Japanese", priceRange: "$$$$", neighborhood: "West Hollywood", description: "Authentic Edomae sushi", website: "https://www.onodera-group.com" },
          { name: "CUT by Wolfgang Puck", cuisine: "Steakhouse", priceRange: "$$$$", neighborhood: "Beverly Hills", description: "Modern steakhouse excellence", website: "https://www.wolfgangpuck.com/dining/cut" },
        ]
      }
    ]
  },
  {
    city: "Miami",
    cityKey: "miami",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$10-25 USD",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        restaurants: [
          { name: "Versailles", cuisine: "Cuban", priceRange: "$", neighborhood: "Little Havana", description: "Iconic Cuban restaurant since 1971", website: "https://www.versaillesrestaurant.com" },
          { name: "La Carreta", cuisine: "Cuban", priceRange: "$", neighborhood: "Multiple locations", description: "Classic Cuban comfort food", website: "https://www.lacarreta.com" },
          { name: "El Rey de las Fritas", cuisine: "Cuban", priceRange: "$", neighborhood: "Little Havana", description: "Famous Cuban burgers", website: "https://www.elreydelasfritas.com" },
          { name: "Taqueria Los Gallos", cuisine: "Mexican", priceRange: "$", neighborhood: "Homestead", description: "Authentic Mexican tacos", website: "https://www.tacoslosgallos.com" },
          { name: "Flanigan's", cuisine: "American", priceRange: "$", neighborhood: "Multiple locations", description: "Local seafood and ribs chain", website: "https://www.flanigans.net" },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$25-50 USD",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        restaurants: [
          { name: "Cvi.che 105", cuisine: "Peruvian", priceRange: "$$", neighborhood: "Downtown", description: "Award-winning ceviche", website: "https://www.cvi-che105.com" },
          { name: "Joe's Stone Crab", cuisine: "Seafood", priceRange: "$$", neighborhood: "South Beach", description: "Miami institution since 1913", website: "https://www.joesstonecrab.com" },
          { name: "Zuma", cuisine: "Japanese", priceRange: "$$", neighborhood: "Downtown", description: "Contemporary Japanese izakaya", website: "https://www.zumarestaurant.com" },
          { name: "MC Kitchen", cuisine: "Italian", priceRange: "$$", neighborhood: "Design District", description: "Modern Italian cooking", website: "https://www.mikiamikitchen.com" },
          { name: "Mandolin Aegean Bistro", cuisine: "Greek/Turkish", priceRange: "$$", neighborhood: "Design District", description: "Mediterranean courtyard dining", website: "https://www.mandolinmiami.com" },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$50-100 USD",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        restaurants: [
          { name: "Stubborn Seed", cuisine: "American", priceRange: "$$$", neighborhood: "South Beach", description: "James Beard award-winning", website: "https://www.stubbornseed.com" },
          { name: "Pao by Paul Qui", cuisine: "Asian Fusion", priceRange: "$$$", neighborhood: "South Beach", description: "Asian-inspired small plates", website: "https://www.paobypaul.com" },
          { name: "COTE Miami", cuisine: "Korean BBQ", priceRange: "$$$", neighborhood: "Design District", description: "Korean steakhouse experience", website: "https://www.cotemiami.com" },
          { name: "Fiola Miami", cuisine: "Italian", priceRange: "$$$", neighborhood: "Coral Gables", description: "Upscale Italian dining", website: "https://www.fioladc.com" },
          { name: "Makoto", cuisine: "Japanese", priceRange: "$$$", neighborhood: "Bal Harbour", description: "Stephen Starr's Japanese spot", website: "https://www.makoto-restaurant.com" },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$100+ USD",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        restaurants: [
          { name: "Ariete", cuisine: "New American", priceRange: "$$$$", neighborhood: "Coconut Grove", description: "Elevated comfort food", website: "https://www.arietecoconutgrove.com" },
          { name: "Le Jardinier", cuisine: "French", priceRange: "$$$$", neighborhood: "Surfside", description: "Vegetable-forward French", website: "https://www.lejardinier-miami.com" },
          { name: "NAOE", cuisine: "Japanese", priceRange: "$$$$", neighborhood: "Brickell", description: "Intimate omakase experience", website: "https://www.naoemiami.com" },
          { name: "The Surf Club Restaurant", cuisine: "French", priceRange: "$$$$", neighborhood: "Surfside", description: "Thomas Keller elegance", website: "https://www.surfclubrestaurant.com" },
          { name: "Hiden", cuisine: "Japanese", priceRange: "$$$$", neighborhood: "Wynwood", description: "Hidden speakeasy omakase", website: "https://www.hidenwynwood.com" },
        ]
      }
    ]
  },
  {
    city: "Dallas",
    cityKey: "dallas",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$10-25 USD",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        restaurants: [
          { name: "Pecan Lodge", cuisine: "BBQ", priceRange: "$", neighborhood: "Deep Ellum", description: "Texas BBQ institution", website: "https://www.pecanlodge.com" },
          { name: "Velvet Taco", cuisine: "Tacos", priceRange: "$", neighborhood: "Multiple locations", description: "Creative gourmet tacos", website: "https://www.velvettaco.com" },
          { name: "Sonny Bryan's", cuisine: "BBQ", priceRange: "$", neighborhood: "Multiple locations", description: "Classic Dallas BBQ since 1910", website: "https://www.sonnybryans.com" },
          { name: "El Fenix", cuisine: "Tex-Mex", priceRange: "$", neighborhood: "Multiple locations", description: "Dallas Tex-Mex since 1918", website: "https://www.elfenix.com" },
          { name: "Whataburger", cuisine: "Burgers", priceRange: "$", neighborhood: "Multiple locations", description: "Texas burger chain favorite", website: "https://www.whataburger.com" },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$25-50 USD",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        restaurants: [
          { name: "Uchi Dallas", cuisine: "Japanese", priceRange: "$$", neighborhood: "Oak Lawn", description: "Austin's beloved sushi comes to Dallas", website: "https://www.uchirestaurants.com/dallas" },
          { name: "Tei-An", cuisine: "Japanese", priceRange: "$$", neighborhood: "Arts District", description: "Artisan soba noodles", website: "https://www.tei-an.com" },
          { name: "CBD Provisions", cuisine: "Texan", priceRange: "$$", neighborhood: "Downtown", description: "Farm-to-table Texan cuisine", website: "https://www.cbdprovisions.com" },
          { name: "Petra and the Beast", cuisine: "American", priceRange: "$$", neighborhood: "Lakewood", description: "Whole-animal butchery", website: "https://www.petraandthebeast.com" },
          { name: "The Grape", cuisine: "American", priceRange: "$$", neighborhood: "Lower Greenville", description: "Dallas classic since 1972", website: "https://www.thegraperestaurant.com" },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$50-100 USD",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        restaurants: [
          { name: "Fearing's", cuisine: "Southwestern", priceRange: "$$$", neighborhood: "Uptown", description: "Dean Fearing's bold Southwestern", website: "https://www.fearingsrestaurant.com" },
          { name: "Nobu Dallas", cuisine: "Japanese", priceRange: "$$$", neighborhood: "Uptown", description: "World-famous Japanese cuisine", website: "https://www.noburestaurants.com" },
          { name: "Town Hearth", cuisine: "Steakhouse", priceRange: "$$$", neighborhood: "Design District", description: "Eccentric steakhouse experience", website: "https://www.townhearth.com" },
          { name: "The French Room", cuisine: "French", priceRange: "$$$", neighborhood: "Downtown", description: "Elegant French in Adolphus Hotel", website: "https://www.thefrenchroom.com" },
          { name: "Knife", cuisine: "Steakhouse", priceRange: "$$$", neighborhood: "Highland Park", description: "John Tesar's modern steakhouse", website: "https://www.knifedallas.com" },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$100+ USD",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        restaurants: [
          { name: "Monarch", cuisine: "Italian", priceRange: "$$$$", neighborhood: "Downtown", description: "Stunning views and Italian cuisine", website: "https://www.monarch-dallas.com" },
          { name: "Nick & Sam's", cuisine: "Steakhouse", priceRange: "$$$$", neighborhood: "Uptown", description: "Premier Dallas steakhouse", website: "https://www.nickandsams.com" },
          { name: "Flora Street Cafe", cuisine: "New American", priceRange: "$$$$", neighborhood: "Arts District", description: "Stephan Pyles' fine dining", website: "https://www.florastreetcafe.com" },
          { name: "Tei Tei Robata Bar", cuisine: "Japanese", priceRange: "$$$$", neighborhood: "Knox/Henderson", description: "Upscale Japanese grill", website: "https://www.teiteidallas.com" },
          { name: "Al Biernat's", cuisine: "Steakhouse", priceRange: "$$$$", neighborhood: "Oak Lawn", description: "Power lunch steakhouse", website: "https://www.albiernats.com" },
        ]
      }
    ]
  },
  {
    city: "Atlanta",
    cityKey: "atlanta",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$10-25 USD",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        restaurants: [
          { name: "Fox Bros. Bar-B-Q", cuisine: "BBQ", priceRange: "$", neighborhood: "Little Five Points", description: "Texas-style BBQ in Atlanta", website: "https://www.foxbrosbbq.com" },
          { name: "The Varsity", cuisine: "American", priceRange: "$", neighborhood: "Midtown", description: "World's largest drive-in since 1928", website: "https://www.thevarsity.com" },
          { name: "Ponce City Market", cuisine: "Food Hall", priceRange: "$", neighborhood: "Old Fourth Ward", description: "Historic market food hall", website: "https://www.poncecitymarket.com" },
          { name: "Busy Bee Cafe", cuisine: "Soul Food", priceRange: "$", neighborhood: "Vine City", description: "Historic soul food since 1947", website: "https://www.thebusybeecafe.com" },
          { name: "Antico Pizza", cuisine: "Pizza", priceRange: "$", neighborhood: "Westside", description: "Authentic Neapolitan pizza", website: "https://www.anticopizza.it" },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$25-50 USD",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        restaurants: [
          { name: "Staplehouse", cuisine: "American", priceRange: "$$", neighborhood: "Old Fourth Ward", description: "James Beard Award winner", website: "https://www.staplehouse.com" },
          { name: "Miller Union", cuisine: "Southern", priceRange: "$$", neighborhood: "Westside", description: "Farm-driven Southern", website: "https://www.millerunion.com" },
          { name: "The Optimist", cuisine: "Seafood", priceRange: "$$", neighborhood: "Westside", description: "Southern coastal seafood", website: "https://www.theoptimistrestaurant.com" },
          { name: "BoccaLupo", cuisine: "Italian", priceRange: "$$", neighborhood: "Inman Park", description: "Handmade pasta specialists", website: "https://www.boccalupoatl.com" },
          { name: "Kimball House", cuisine: "American", priceRange: "$$", neighborhood: "Decatur", description: "Oyster bar and Southern kitchen", website: "https://www.kimball-house.com" },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$50-100 USD",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        restaurants: [
          { name: "Bacchanalia", cuisine: "American", priceRange: "$$$", neighborhood: "Westside", description: "Atlanta's most celebrated restaurant", website: "https://www.starprovisions.com" },
          { name: "Empire State South", cuisine: "Southern", priceRange: "$$$", neighborhood: "Midtown", description: "Hugh Acheson's flagship", website: "https://www.empirestatesouth.com" },
          { name: "Aria", cuisine: "American", priceRange: "$$$", neighborhood: "Buckhead", description: "Elegant seasonal cuisine", website: "https://www.aria-atl.com" },
          { name: "The Castellucci Hospitality Group", cuisine: "Italian", priceRange: "$$$", neighborhood: "Buckhead", description: "Refined Italian cuisine", website: "https://www.castelluccihospitalitygroup.com" },
          { name: "Marcel", cuisine: "Steakhouse", priceRange: "$$$", neighborhood: "Westside", description: "Retro steakhouse vibes", website: "https://www.marcelatl.com" },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$100+ USD",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        restaurants: [
          { name: "Atlas", cuisine: "American", priceRange: "$$$$", neighborhood: "Buckhead", description: "Fine dining in art-filled space", website: "https://www.atlasrestaurant.com" },
          { name: "Bones", cuisine: "Steakhouse", priceRange: "$$$$", neighborhood: "Buckhead", description: "Atlanta's premier steakhouse", website: "https://www.bonesrestaurant.com" },
          { name: "Restaurant Eugene", cuisine: "Southern", priceRange: "$$$$", neighborhood: "South Buckhead", description: "Upscale modern Southern", website: "https://www.restauranteugene.com" },
          { name: "Chops Lobster Bar", cuisine: "Steakhouse", priceRange: "$$$$", neighborhood: "Buckhead", description: "Classic power steakhouse", website: "https://www.buckheadrestaurants.com" },
          { name: "Nikolai's Roof", cuisine: "Continental", priceRange: "$$$$", neighborhood: "Downtown", description: "Romantic rooftop dining", website: "https://www.nikolaisroof.com" },
        ]
      }
    ]
  },
  {
    city: "Houston",
    cityKey: "houston",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$10-25 USD",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        restaurants: [
          { name: "Killen's Barbecue", cuisine: "BBQ", priceRange: "$", neighborhood: "Pearland", description: "Award-winning Texas BBQ", website: "https://www.killensbarbecue.com" },
          { name: "Pho Binh", cuisine: "Vietnamese", priceRange: "$", neighborhood: "Midtown", description: "Late-night pho favorite", website: "https://www.phobinh.com" },
          { name: "El Tiempo Cantina", cuisine: "Tex-Mex", priceRange: "$", neighborhood: "Multiple locations", description: "Houston Tex-Mex royalty", website: "https://www.eltiempocantina.com" },
          { name: "Niko Niko's", cuisine: "Greek", priceRange: "$", neighborhood: "Montrose", description: "Greek comfort food", website: "https://www.nikonikos.com" },
          { name: "Pappas Bros. Steakhouse", cuisine: "Steakhouse", priceRange: "$", neighborhood: "Galleria", description: "Texas steakhouse tradition", website: "https://www.pappasbros.com" },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$25-50 USD",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        restaurants: [
          { name: "Underbelly Hospitality", cuisine: "American", priceRange: "$$", neighborhood: "Montrose", description: "Chris Shepherd's empire", website: "https://www.underbellyhospitality.com" },
          { name: "Xochi", cuisine: "Mexican", priceRange: "$$", neighborhood: "Downtown", description: "Oaxacan cuisine celebration", website: "https://www.xochihouston.com" },
          { name: "Brennan's of Houston", cuisine: "Creole", priceRange: "$$", neighborhood: "Midtown", description: "New Orleans-style elegance", website: "https://www.brennanshouston.com" },
          { name: "State of Grace", cuisine: "American", priceRange: "$$", neighborhood: "River Oaks", description: "Elevated comfort classics", website: "https://www.stateofgracetx.com" },
          { name: "Uchi Houston", cuisine: "Japanese", priceRange: "$$", neighborhood: "Montrose", description: "James Beard-winning sushi", website: "https://www.uchirestaurants.com/houston" },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$50-100 USD",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        restaurants: [
          { name: "Pappas Bros. Steakhouse", cuisine: "Steakhouse", priceRange: "$$$", neighborhood: "Galleria", description: "Premier Houston steakhouse", website: "https://www.pappasbros.com" },
          { name: "March", cuisine: "American", priceRange: "$$$", neighborhood: "Montrose", description: "Fine dining destination", website: "https://www.marchhouston.com" },
          { name: "Kata Robata", cuisine: "Japanese", priceRange: "$$$", neighborhood: "Upper Kirby", description: "Sophisticated sushi bar", website: "https://www.katarobata.com" },
          { name: "Turner's", cuisine: "Steakhouse", priceRange: "$$$", neighborhood: "Montrose", description: "Butcher shop and steakhouse", website: "https://www.turnershouston.com" },
          { name: "Le Jardinier", cuisine: "French", priceRange: "$$$", neighborhood: "Museum District", description: "Vegetable-forward French", website: "https://www.lejardinier.com" },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$100+ USD",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        restaurants: [
          { name: "The Pass & Provisions", cuisine: "American", priceRange: "$$$$", neighborhood: "Montrose", description: "Tasting menu excellence", website: "https://www.passandprovisions.com" },
          { name: "Da Marco", cuisine: "Italian", priceRange: "$$$$", neighborhood: "Montrose", description: "Refined Italian dining", website: "https://www.damarcohouston.com" },
          { name: "Peska Seafood Culture", cuisine: "Seafood", priceRange: "$$$$", neighborhood: "Galleria", description: "Upscale Mexican seafood", website: "https://www.peskahouston.com" },
          { name: "Mastro's Steakhouse", cuisine: "Steakhouse", priceRange: "$$$$", neighborhood: "Galleria", description: "Upscale dining experience", website: "https://www.mastrosrestaurants.com" },
          { name: "Nobu Houston", cuisine: "Japanese", priceRange: "$$$$", neighborhood: "Galleria", description: "Celebrity chef Japanese", website: "https://www.noburestaurants.com" },
        ]
      }
    ]
  },
  {
    city: "Seattle",
    cityKey: "seattle",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$10-25 USD",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        restaurants: [
          { name: "Pike Place Chowder", cuisine: "Seafood", priceRange: "$", neighborhood: "Pike Place", description: "Award-winning chowder", website: "https://www.pikeplacechowder.com" },
          { name: "Paseo", cuisine: "Caribbean", priceRange: "$", neighborhood: "Fremont", description: "Cuban-Caribbean sandwiches", website: "https://www.paseorestaurants.com" },
          { name: "Dick's Drive-In", cuisine: "Burgers", priceRange: "$", neighborhood: "Multiple locations", description: "Seattle burger institution", website: "https://www.dfranchisees.com" },
          { name: "Salumi Artisan Cured Meats", cuisine: "Italian Deli", priceRange: "$", neighborhood: "Pioneer Square", description: "Artisan salumi sandwiches", website: "https://www.salumicuredmeats.com" },
          { name: "Tacos Chukis", cuisine: "Mexican", priceRange: "$", neighborhood: "Capitol Hill", description: "Authentic street tacos", website: "https://www.tacoschukis.com" },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$25-50 USD",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        restaurants: [
          { name: "Canlis", cuisine: "Pacific Northwest", priceRange: "$$", neighborhood: "Queen Anne", description: "Seattle's iconic fine dining", website: "https://www.canlis.com" },
          { name: "The Walrus and the Carpenter", cuisine: "Oyster Bar", priceRange: "$$", neighborhood: "Ballard", description: "Beloved oyster bar", website: "https://www.thewalrusbar.com" },
          { name: "Bateau", cuisine: "Steakhouse", priceRange: "$$", neighborhood: "Capitol Hill", description: "Whole-animal steakhouse", website: "https://www.restaurantbateau.com" },
          { name: "Altura", cuisine: "Italian", priceRange: "$$", neighborhood: "Capitol Hill", description: "Pacific NW meets Italian", website: "https://www.alturarestaurant.com" },
          { name: "Eden Hill", cuisine: "American", priceRange: "$$", neighborhood: "Queen Anne", description: "Cozy seasonal tasting menus", website: "https://www.edenhillrestaurant.com" },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$50-100 USD",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        restaurants: [
          { name: "The Herbfarm", cuisine: "Pacific Northwest", priceRange: "$$$", neighborhood: "Woodinville", description: "9-course farm dinners", website: "https://www.theherbfarm.com" },
          { name: "Sushi Kashiba", cuisine: "Japanese", priceRange: "$$$", neighborhood: "Pike Place", description: "Master chef omakase", website: "https://www.sushikashiba.com" },
          { name: "Westward", cuisine: "Seafood", priceRange: "$$$", neighborhood: "Eastlake", description: "Waterfront Mediterranean", website: "https://www.westwardseattle.com" },
          { name: "Spinasse", cuisine: "Italian", priceRange: "$$$", neighborhood: "Capitol Hill", description: "Piedmontese Italian", website: "https://www.spinasse.com" },
          { name: "Tarsan i Jane", cuisine: "Spanish", priceRange: "$$$", neighborhood: "Queen Anne", description: "Intimate Catalan cuisine", website: "https://www.tarsanijane.com" },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$100+ USD",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        restaurants: [
          { name: "Canlis", cuisine: "Pacific Northwest", priceRange: "$$$$", neighborhood: "Queen Anne", description: "Seattle's legendary fine dining", website: "https://www.canlis.com" },
          { name: "The Herbfarm", cuisine: "Farm-to-table", priceRange: "$$$$", neighborhood: "Woodinville", description: "Legendary 9-course experience", website: "https://www.theherbfarm.com" },
          { name: "Shiro's", cuisine: "Japanese", priceRange: "$$$$", neighborhood: "Belltown", description: "Traditional Edomae sushi", website: "https://www.shiros.com" },
          { name: "Metropolitan Grill", cuisine: "Steakhouse", priceRange: "$$$$", neighborhood: "Downtown", description: "Power steakhouse", website: "https://www.themetropolitangrill.com" },
          { name: "El Gaucho", cuisine: "Steakhouse", priceRange: "$$$$", neighborhood: "Belltown", description: "Classic supper club", website: "https://www.elgaucho.com" },
        ]
      }
    ]
  },
  {
    city: "San Francisco Bay Area",
    cityKey: "sanFrancisco",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$10-25 USD",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        restaurants: [
          { name: "Tartine Bakery", cuisine: "Bakery", priceRange: "$", neighborhood: "Mission", description: "Iconic SF bakery", website: "https://www.tartinebakery.com" },
          { name: "La Taqueria", cuisine: "Mexican", priceRange: "$", neighborhood: "Mission", description: "Best burrito debate contender", website: "https://www.lataqueriasf.com" },
          { name: "Burma Superstar", cuisine: "Burmese", priceRange: "$", neighborhood: "Inner Richmond", description: "Popular Burmese cuisine", website: "https://www.burmasuperstar.com" },
          { name: "Bi-Rite Creamery", cuisine: "Ice Cream", priceRange: "$", neighborhood: "Mission", description: "Small-batch ice cream", website: "https://www.biritecreamery.com" },
          { name: "Swan Oyster Depot", cuisine: "Seafood", priceRange: "$", neighborhood: "Nob Hill", description: "Counter-only oyster bar", website: "https://www.swanoysterdepot.com" },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$25-50 USD",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        restaurants: [
          { name: "State Bird Provisions", cuisine: "American", priceRange: "$$", neighborhood: "Fillmore", description: "Dim sum-style service", website: "https://www.statebirdsf.com" },
          { name: "Zuni Cafe", cuisine: "Californian", priceRange: "$$", neighborhood: "Hayes Valley", description: "SF institution, famous chicken", website: "https://www.zunicafe.com" },
          { name: "Nopa", cuisine: "Californian", priceRange: "$$", neighborhood: "Western Addition", description: "Organic wood-fired cooking", website: "https://www.nopasf.com" },
          { name: "Rich Table", cuisine: "American", priceRange: "$$", neighborhood: "Hayes Valley", description: "Creative seasonal cooking", website: "https://www.richtablesf.com" },
          { name: "The Progress", cuisine: "American", priceRange: "$$", neighborhood: "Fillmore", description: "Family-style tasting menu", website: "https://www.theprogresssf.com" },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$50-100 USD",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        restaurants: [
          { name: "Californios", cuisine: "Mexican", priceRange: "$$$", neighborhood: "Mission", description: "Two Michelin star Mexican", website: "https://www.californiossf.com" },
          { name: "Lazy Bear", cuisine: "American", priceRange: "$$$", neighborhood: "Mission", description: "Dinner party experience", website: "https://www.lazybearsf.com" },
          { name: "Quince", cuisine: "Italian", priceRange: "$$$", neighborhood: "Jackson Square", description: "Three Michelin stars", website: "https://www.quincerestaurant.com" },
          { name: "Acquerello", cuisine: "Italian", priceRange: "$$$", neighborhood: "Nob Hill", description: "Refined Italian tasting", website: "https://www.acquerello.com" },
          { name: "Spruce", cuisine: "American", priceRange: "$$$", neighborhood: "Presidio Heights", description: "Elegant California cuisine", website: "https://www.sprucesf.com" },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$100+ USD",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        restaurants: [
          { name: "Benu", cuisine: "Asian Fusion", priceRange: "$$$$", neighborhood: "SoMa", description: "Three Michelin star Asian", website: "https://www.benusf.com" },
          { name: "Saison", cuisine: "American", priceRange: "$$$$", neighborhood: "SoMa", description: "Three Michelin star tasting", website: "https://www.saisonsf.com" },
          { name: "Atelier Crenn", cuisine: "French", priceRange: "$$$$", neighborhood: "Marina", description: "Three Michelin stars", website: "https://www.ateliercrenn.com" },
          { name: "The French Laundry", cuisine: "French-American", priceRange: "$$$$", neighborhood: "Napa Valley", description: "Thomas Keller's legendary spot", website: "https://www.thomaskeller.com/tfl" },
          { name: "Manresa", cuisine: "New American", priceRange: "$$$$", neighborhood: "Los Gatos", description: "Three Michelin star experience", website: "https://www.manresarestaurant.com" },
        ]
      }
    ]
  },
  {
    city: "Boston",
    cityKey: "boston",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$10-25 USD",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        restaurants: [
          { name: "Mike's Pastry", cuisine: "Italian Bakery", priceRange: "$", neighborhood: "North End", description: "Famous cannoli and pastries", website: "https://www.mikespastry.com" },
          { name: "Neptune Oyster", cuisine: "Seafood", priceRange: "$", neighborhood: "North End", description: "Tiny but mighty seafood bar", website: "https://www.neptuneoyster.com" },
          { name: "Santarpio's Pizza", cuisine: "Pizza", priceRange: "$", neighborhood: "East Boston", description: "Old-school pizza and lamb", website: "https://www.santarpiospizza.com" },
          { name: "El Pelon Taqueria", cuisine: "Mexican", priceRange: "$", neighborhood: "Fenway", description: "Authentic fish tacos", website: "https://www.elpelontaqueria.com" },
          { name: "Legal Sea Foods", cuisine: "Seafood", priceRange: "$", neighborhood: "Multiple locations", description: "Boston seafood institution", website: "https://www.legalseafoods.com" },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$25-50 USD",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        restaurants: [
          { name: "Row 34", cuisine: "Seafood", priceRange: "$$", neighborhood: "Fort Point", description: "Oyster bar and craft beer", website: "https://www.row34.com" },
          { name: "Myers + Chang", cuisine: "Asian Fusion", priceRange: "$$", neighborhood: "South End", description: "Funky Asian-inspired", website: "https://www.myersandchang.com" },
          { name: "Coppa", cuisine: "Italian", priceRange: "$$", neighborhood: "South End", description: "Italian enoteca", website: "https://www.coppaboston.com" },
          { name: "Oleana", cuisine: "Mediterranean", priceRange: "$$", neighborhood: "Cambridge", description: "Middle Eastern flavors", website: "https://www.oleanarestaurant.com" },
          { name: "Craigie on Main", cuisine: "French", priceRange: "$$", neighborhood: "Cambridge", description: "Nose-to-tail cooking", website: "https://www.craigieonmain.com" },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$50-100 USD",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        restaurants: [
          { name: "No. 9 Park", cuisine: "French-Italian", priceRange: "$$$", neighborhood: "Beacon Hill", description: "Barbara Lynch flagship", website: "https://www.no9park.com" },
          { name: "Menton", cuisine: "French", priceRange: "$$$", neighborhood: "Fort Point", description: "Elegant French fine dining", website: "https://www.mentonboston.com" },
          { name: "Toro", cuisine: "Spanish", priceRange: "$$$", neighborhood: "South End", description: "Barcelona-style tapas", website: "https://www.toro-restaurant.com" },
          { name: "Uni", cuisine: "Japanese", priceRange: "$$$", neighborhood: "Back Bay", description: "Izakaya and sashimi bar", website: "https://www.uni-boston.com" },
          { name: "Sarma", cuisine: "Mediterranean", priceRange: "$$$", neighborhood: "Somerville", description: "Meze and cocktails", website: "https://www.sarmarestaurant.com" },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$100+ USD",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        restaurants: [
          { name: "Menton", cuisine: "French", priceRange: "$$$$", neighborhood: "Fort Point", description: "Barbara Lynch's fine dining", website: "https://www.mentonboston.com" },
          { name: "o ya", cuisine: "Japanese", priceRange: "$$$$", neighborhood: "Leather District", description: "Michelin-starred omakase", website: "https://www.oyarestaurantboston.com" },
          { name: "L'Espalier", cuisine: "French", priceRange: "$$$$", neighborhood: "Back Bay", description: "Modern French elegance", website: "https://www.lespalier.com" },
          { name: "Asta", cuisine: "American", priceRange: "$$$$", neighborhood: "Back Bay", description: "Creative tasting menus", website: "https://www.astaboston.com" },
          { name: "Grill 23 & Bar", cuisine: "Steakhouse", priceRange: "$$$$", neighborhood: "Back Bay", description: "Boston's premier steakhouse", website: "https://www.grill23.com" },
        ]
      }
    ]
  },
  {
    city: "Philadelphia",
    cityKey: "philadelphia",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$10-25 USD",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        restaurants: [
          { name: "Pat's King of Steaks", cuisine: "Cheesesteaks", priceRange: "$", neighborhood: "South Philly", description: "Original cheesesteak since 1930", website: "https://www.patskingofsteaks.com" },
          { name: "Geno's Steaks", cuisine: "Cheesesteaks", priceRange: "$", neighborhood: "South Philly", description: "Pat's famous rival", website: "https://www.genosteaks.com" },
          { name: "Reading Terminal Market", cuisine: "Food Hall", priceRange: "$", neighborhood: "Center City", description: "Historic indoor market", website: "https://www.readingterminalmarket.org" },
          { name: "Federal Donuts", cuisine: "Donuts/Chicken", priceRange: "$", neighborhood: "Multiple locations", description: "Korean fried chicken & donuts", website: "https://www.federaldonuts.com" },
          { name: "John's Roast Pork", cuisine: "Sandwiches", priceRange: "$", neighborhood: "South Philly", description: "Best roast pork sandwich", website: "https://www.johnsroastpork.com" },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$25-50 USD",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        restaurants: [
          { name: "Zahav", cuisine: "Israeli", priceRange: "$$", neighborhood: "Society Hill", description: "James Beard Award winner", website: "https://www.zahavrestaurant.com" },
          { name: "Vernick Food & Drink", cuisine: "American", priceRange: "$$", neighborhood: "Rittenhouse", description: "Gregory Vernick's flagship", website: "https://www.vernickphilly.com" },
          { name: "Talula's Garden", cuisine: "American", priceRange: "$$", neighborhood: "Washington Square", description: "Farm-to-table seasonal", website: "https://www.talulasgarden.com" },
          { name: "Vetri Cucina", cuisine: "Italian", priceRange: "$$", neighborhood: "Center City", description: "Marc Vetri's tasting menu", website: "https://www.vetricucina.com" },
          { name: "Fork", cuisine: "American", priceRange: "$$", neighborhood: "Old City", description: "Philadelphia fine dining pioneer", website: "https://www.forkrestaurant.com" },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$50-100 USD",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        restaurants: [
          { name: "Lacroix at The Rittenhouse", cuisine: "French", priceRange: "$$$", neighborhood: "Rittenhouse", description: "Elegant hotel dining", website: "https://www.lacroixrestaurant.com" },
          { name: "Morimoto", cuisine: "Japanese", priceRange: "$$$", neighborhood: "Washington Square West", description: "Iron Chef's flagship", website: "https://www.morimotorestaurant.com" },
          { name: "Barclay Prime", cuisine: "Steakhouse", priceRange: "$$$", neighborhood: "Rittenhouse", description: "Library-themed steakhouse", website: "https://www.barclayprime.com" },
          { name: "Friday Saturday Sunday", cuisine: "American", priceRange: "$$$", neighborhood: "Rittenhouse", description: "Creative seasonal menus", website: "https://www.fridaysaturdaysunday.com" },
          { name: "a.kitchen + bar", cuisine: "American", priceRange: "$$$", neighborhood: "Rittenhouse", description: "Modern neighborhood gem", website: "https://www.akitchenandbar.com" },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$100+ USD",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        restaurants: [
          { name: "Laurel", cuisine: "French", priceRange: "$$$$", neighborhood: "Passyunk", description: "BYO tasting menu gem", website: "https://www.laurelphilly.com" },
          { name: "Le Cavalier at The Green Room", cuisine: "French", priceRange: "$$$$", neighborhood: "Center City", description: "Historic hotel elegance", website: "https://www.lecavalierrestaurant.com" },
          { name: "The Capital Grille", cuisine: "Steakhouse", priceRange: "$$$$", neighborhood: "Avenue of the Arts", description: "Classic power steakhouse", website: "https://www.thecapitalgrille.com" },
          { name: "Del Frisco's Double Eagle", cuisine: "Steakhouse", priceRange: "$$$$", neighborhood: "Avenue of the Arts", description: "Upscale steakhouse chain", website: "https://www.delfriscos.com" },
          { name: "The Fountain Restaurant", cuisine: "Continental", priceRange: "$$$$", neighborhood: "Logan Square", description: "Four Seasons elegance", website: "https://www.fourseasons.com/philadelphia" },
        ]
      }
    ]
  },
  {
    city: "Kansas City",
    cityKey: "kansasCity",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$10-25 USD",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        restaurants: [
          { name: "Joe's Kansas City BBQ", cuisine: "BBQ", priceRange: "$", neighborhood: "Kansas City, KS", description: "Famous Z-Man sandwich", website: "https://www.joeskc.com" },
          { name: "Gates Bar-B-Q", cuisine: "BBQ", priceRange: "$", neighborhood: "Multiple locations", description: "KC BBQ since 1946", website: "https://www.gatesbbq.com" },
          { name: "Arthur Bryant's", cuisine: "BBQ", priceRange: "$", neighborhood: "18th & Vine", description: "Historic BBQ landmark", website: "https://www.arthurbryantsbbq.com" },
          { name: "Q39", cuisine: "BBQ", priceRange: "$", neighborhood: "Midtown", description: "Modern KC BBQ", website: "https://www.q39kc.com" },
          { name: "Town Topic", cuisine: "Burgers", priceRange: "$", neighborhood: "Downtown", description: "24-hour diner since 1937", website: "https://www.towntopic.com" },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$25-50 USD",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        restaurants: [
          { name: "Lidia's", cuisine: "Italian", priceRange: "$$", neighborhood: "Crossroads", description: "Lidia Bastianich's KC spot", website: "https://www.lidias-kc.com" },
          { name: "The Rieger", cuisine: "American", priceRange: "$$", neighborhood: "Crossroads", description: "Farm-to-table pioneer", website: "https://www.therieger.com" },
          { name: "Extra Virgin", cuisine: "Mediterranean", priceRange: "$$", neighborhood: "Crossroads", description: "Tapas and small plates", website: "https://www.extravirginkc.com" },
          { name: "Westport Cafe", cuisine: "French", priceRange: "$$", neighborhood: "Westport", description: "Classic French bistro", website: "https://www.westportcafeandbar.com" },
          { name: "Gram & Dun", cuisine: "American", priceRange: "$$", neighborhood: "Crossroads", description: "Inventive American fare", website: "https://www.gramanddun.com" },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$50-100 USD",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        restaurants: [
          { name: "The American Restaurant", cuisine: "American", priceRange: "$$$", neighborhood: "Crown Center", description: "KC fine dining landmark", website: "https://www.theamericankc.com" },
          { name: "Bluestem", cuisine: "American", priceRange: "$$$", neighborhood: "Westport", description: "Colby & Megan Garrelts", website: "https://www.bluestemkc.com" },
          { name: "Bristol Seafood Grill", cuisine: "Seafood", priceRange: "$$$", neighborhood: "Country Club Plaza", description: "Upscale seafood", website: "https://www.bristolseafoodgrill.com" },
          { name: "Eddie V's", cuisine: "Seafood", priceRange: "$$$", neighborhood: "Country Club Plaza", description: "Prime seafood and steaks", website: "https://www.eddiev.com" },
          { name: "Stock Hill", cuisine: "Steakhouse", priceRange: "$$$", neighborhood: "Country Club Plaza", description: "Modern KC steakhouse", website: "https://www.stockhillkc.com" },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$100+ USD",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        restaurants: [
          { name: "Rye", cuisine: "American", priceRange: "$$$$", neighborhood: "Leawood", description: "Refined Midwest cuisine", website: "https://www.ryekc.com" },
          { name: "The Capital Grille", cuisine: "Steakhouse", priceRange: "$$$$", neighborhood: "Country Club Plaza", description: "Classic steakhouse", website: "https://www.thecapitalgrille.com" },
          { name: "Fogo de Chao", cuisine: "Brazilian", priceRange: "$$$$", neighborhood: "Country Club Plaza", description: "Brazilian steakhouse", website: "https://www.fogodechao.com" },
          { name: "Plaza III Steakhouse", cuisine: "Steakhouse", priceRange: "$$$$", neighborhood: "Country Club Plaza", description: "KC steak tradition", website: "https://www.plazaiiisteakhouse.com" },
          { name: "801 Chophouse", cuisine: "Steakhouse", priceRange: "$$$$", neighborhood: "Power & Light", description: "Prime cuts downtown", website: "https://www.801chophouse.com" },
        ]
      }
    ]
  },
  {
    city: "Toronto",
    cityKey: "toronto",
    country: "Canada",
    countryKey: "canada",
    countryCode: "ca",
    categories: [
      {
        category: "Budget",
        priceRange: "CAD $15-35",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        restaurants: [
          { name: "St. Lawrence Market", cuisine: "Food Hall", priceRange: "$", neighborhood: "Old Toronto", description: "Historic market since 1803", website: "https://www.stlawrencemarket.com" },
          { name: "Banh Mi Boys", cuisine: "Vietnamese", priceRange: "$", neighborhood: "Multiple locations", description: "Creative banh mi sandwiches", website: "https://www.banhmiboys.com" },
          { name: "Pai Northern Thai Kitchen", cuisine: "Thai", priceRange: "$", neighborhood: "Entertainment District", description: "Authentic Northern Thai", website: "https://www.paitoronto.com" },
          { name: "Seven Lives", cuisine: "Mexican", priceRange: "$", neighborhood: "Kensington Market", description: "Baja-style fish tacos", website: "https://www.sevenlives.ca" },
          { name: "Pho Tien Thanh", cuisine: "Vietnamese", priceRange: "$", neighborhood: "Chinatown", description: "Best pho in Toronto", website: "https://www.photienthanh.com" },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "CAD $35-70",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        restaurants: [
          { name: "Richmond Station", cuisine: "Canadian", priceRange: "$$", neighborhood: "Downtown", description: "Farm-to-table Canadian", website: "https://www.richmondstation.ca" },
          { name: "Byblos", cuisine: "Eastern Mediterranean", priceRange: "$$", neighborhood: "Entertainment District", description: "Lebanese-inspired elegance", website: "https://www.byblostoronto.com" },
          { name: "Enoteca Sociale", cuisine: "Italian", priceRange: "$$", neighborhood: "College/Dundas", description: "Roman trattoría", website: "https://www.sociale.ca" },
          { name: "Momofuku Noodle Bar", cuisine: "Asian", priceRange: "$$", neighborhood: "University", description: "David Chang's Toronto spot", website: "https://www.momofuku.com" },
          { name: "Canoe", cuisine: "Canadian", priceRange: "$$", neighborhood: "Financial District", description: "54th-floor views", website: "https://www.canoerestaurant.com" },
        ]
      },
      {
        category: "Upscale",
        priceRange: "CAD $70-120",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        restaurants: [
          { name: "Alo", cuisine: "French", priceRange: "$$$", neighborhood: "Queen West", description: "Canada's best restaurant", website: "https://www.alorestaurant.com" },
          { name: "Edulis", cuisine: "French-Spanish", priceRange: "$$$", neighborhood: "Niagara", description: "Intimate tasting menus", website: "https://www.edulisrestaurant.com" },
          { name: "Kaiseki Yu-zen Hashimoto", cuisine: "Japanese", priceRange: "$$$", neighborhood: "North York", description: "Traditional kaiseki", website: "https://www.kaisekihashimoto.com" },
          { name: "Quetzal", cuisine: "Mexican", priceRange: "$$$", neighborhood: "Dundas West", description: "Elevated Mexican cuisine", website: "https://www.quetzaltoronto.com" },
          { name: "Grey Gardens", cuisine: "Canadian", priceRange: "$$$", neighborhood: "Kensington Market", description: "Wine-focused dining", website: "https://www.greygardens.ca" },
        ]
      },
      {
        category: "Luxury",
        priceRange: "CAD $120+",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        restaurants: [
          { name: "Sushi Masaki Saito", cuisine: "Japanese", priceRange: "$$$$", neighborhood: "Yorkville", description: "Michelin-starred omakase", website: "https://www.sushimasakisaito.com" },
          { name: "George", cuisine: "Canadian", priceRange: "$$$$", neighborhood: "Queen West", description: "Fine dining institution", website: "https://www.georgeonqueen.com" },
          { name: "Scaramouche", cuisine: "French", priceRange: "$$$$", neighborhood: "Deer Park", description: "Skyline views since 1980", website: "https://www.scaramoucherestaurant.com" },
          { name: "Jacobs & Co.", cuisine: "Steakhouse", priceRange: "$$$$", neighborhood: "King West", description: "Toronto's premier steakhouse", website: "https://www.jacobssteakhouse.com" },
          { name: "Don Alfonso 1890", cuisine: "Italian", priceRange: "$$$$", neighborhood: "Yorkville", description: "Michelin-starred Italian", website: "https://www.donalfonso.ca" },
        ]
      }
    ]
  },
  {
    city: "Vancouver",
    cityKey: "vancouver",
    country: "Canada",
    countryKey: "canada",
    countryCode: "ca",
    categories: [
      {
        category: "Budget",
        priceRange: "CAD $15-35",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        restaurants: [
          { name: "Japadog", cuisine: "Japanese", priceRange: "$", neighborhood: "Downtown", description: "Japanese-style hot dogs", website: "https://www.japadog.com" },
          { name: "Tacofino", cuisine: "Mexican", priceRange: "$", neighborhood: "Multiple locations", description: "Baja-inspired tacos", website: "https://www.tacofino.com" },
          { name: "Phnom Penh", cuisine: "Vietnamese/Cambodian", priceRange: "$", neighborhood: "Chinatown", description: "Famous butter beef", website: "https://www.phnompenhrestaurant.ca" },
          { name: "Granville Island Market", cuisine: "Food Hall", priceRange: "$", neighborhood: "Granville Island", description: "Iconic public market", website: "https://www.granvilleisland.com" },
          { name: "Ramen Danbo", cuisine: "Japanese", priceRange: "$", neighborhood: "Multiple locations", description: "Authentic Fukuoka ramen", website: "https://www.ramendanbo.com" },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "CAD $35-70",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        restaurants: [
          { name: "Vij's", cuisine: "Indian", priceRange: "$$", neighborhood: "Cambie Village", description: "Vancouver Indian institution", website: "https://www.vijs.ca" },
          { name: "Miku", cuisine: "Japanese", priceRange: "$$", neighborhood: "Coal Harbour", description: "Aburi sushi pioneer", website: "https://www.mikurestaurant.com" },
          { name: "Kissa Tanto", cuisine: "Italian-Japanese", priceRange: "$$", neighborhood: "Chinatown", description: "Creative fusion dining", website: "https://www.kissatanto.com" },
          { name: "AnnaLena", cuisine: "Canadian", priceRange: "$$", neighborhood: "Kitsilano", description: "Modern Canadian cuisine", website: "https://www.annalena.ca" },
          { name: "Bao Bei", cuisine: "Chinese", priceRange: "$$", neighborhood: "Chinatown", description: "Modern Chinese brasserie", website: "https://www.bao-bei.ca" },
        ]
      },
      {
        category: "Upscale",
        priceRange: "CAD $70-120",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        restaurants: [
          { name: "Hawksworth", cuisine: "Canadian", priceRange: "$$$", neighborhood: "Downtown", description: "Vancouver's top restaurant", website: "https://www.hawksworthrestaurant.com" },
          { name: "Boulevard Kitchen & Oyster Bar", cuisine: "Seafood", priceRange: "$$$", neighborhood: "Downtown", description: "Pacific Northwest seafood", website: "https://www.boulevardvancouver.ca" },
          { name: "Pidgin", cuisine: "Asian Fusion", priceRange: "$$$", neighborhood: "Gastown", description: "Creative Asian-French", website: "https://www.pidginvancouver.com" },
          { name: "St. Lawrence", cuisine: "French-Canadian", priceRange: "$$$", neighborhood: "Railtown", description: "Quebec-inspired cuisine", website: "https://www.stlawrencerestaurant.com" },
          { name: "Published on Main", cuisine: "Canadian", priceRange: "$$$", neighborhood: "Mount Pleasant", description: "Tasting menu experience", website: "https://www.publishedonmain.com" },
        ]
      },
      {
        category: "Luxury",
        priceRange: "CAD $120+",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        restaurants: [
          { name: "Tojo's", cuisine: "Japanese", priceRange: "$$$$", neighborhood: "Fairview", description: "Legendary omakase", website: "https://www.tojos.com" },
          { name: "Masayoshi", cuisine: "Japanese", priceRange: "$$$$", neighborhood: "Kitsilano", description: "Intimate omakase counter", website: "https://www.masayoshi.ca" },
          { name: "CinCin", cuisine: "Italian", priceRange: "$$$$", neighborhood: "Downtown", description: "Elegant Italian dining", website: "https://www.cincin.net" },
          { name: "L'Abattoir", cuisine: "French", priceRange: "$$$$", neighborhood: "Gastown", description: "Gastown fine dining", website: "https://www.labattoir.ca" },
          { name: "Glowbal", cuisine: "International", priceRange: "$$$$", neighborhood: "Yaletown", description: "Upscale dining destination", website: "https://www.glowbalgroup.com" },
        ]
      }
    ]
  },
  {
    city: "Mexico City",
    cityKey: "mexicoCity",
    country: "Mexico",
    countryKey: "mexico",
    countryCode: "mx",
    categories: [
      {
        category: "Budget",
        priceRange: "MXN $100-300",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        restaurants: [
          { name: "El Huequito", cuisine: "Tacos", priceRange: "$", neighborhood: "Centro", description: "Famous tacos al pastor since 1959", website: "https://www.elhuequito.com.mx" },
          { name: "Taqueria Orinoco", cuisine: "Tacos", priceRange: "$", neighborhood: "Multiple locations", description: "Northern-style tacos", website: "https://www.tacosorinoco.com" },
          { name: "Mercado Roma", cuisine: "Food Hall", priceRange: "$", neighborhood: "Roma Norte", description: "Gourmet food market", website: "https://www.mercadoroma.com" },
          { name: "El Vilsito", cuisine: "Tacos", priceRange: "$", neighborhood: "Narvarte", description: "Late-night taco mechanic shop", website: "https://www.facebook.com/elvilsito" },
          { name: "Contramar", cuisine: "Seafood", priceRange: "$", neighborhood: "Roma Norte", description: "Iconic casual seafood", website: "https://www.contramar.com.mx" },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "MXN $300-600",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        restaurants: [
          { name: "Pujol", cuisine: "Mexican", priceRange: "$$", neighborhood: "Polanco", description: "Enrique Olvera's world-famous", website: "https://www.pujol.com.mx" },
          { name: "Quintonil", cuisine: "Mexican", priceRange: "$$", neighborhood: "Polanco", description: "World's best restaurants list", website: "https://www.quintonil.com" },
          { name: "Maximo Bistrot", cuisine: "Mexican", priceRange: "$$", neighborhood: "Roma Norte", description: "Farm-to-table market cuisine", website: "https://www.maximobistrot.com.mx" },
          { name: "Rosetta", cuisine: "Italian-Mexican", priceRange: "$$", neighborhood: "Roma Norte", description: "Elena Reygadas' masterpiece", website: "https://www.rosetta.com.mx" },
          { name: "Lardo", cuisine: "Mediterranean", priceRange: "$$", neighborhood: "Roma Norte", description: "All-day neighborhood favorite", website: "https://www.lardo.mx" },
        ]
      },
      {
        category: "Upscale",
        priceRange: "MXN $600-1,200",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        restaurants: [
          { name: "Sud 777", cuisine: "Mexican", priceRange: "$$$", neighborhood: "Pedregal", description: "Modern Mexican excellence", website: "https://www.sud777.com.mx" },
          { name: "Biko", cuisine: "Basque-Mexican", priceRange: "$$$", neighborhood: "Polanco", description: "Spanish-Mexican fusion", website: "https://www.biko.com.mx" },
          { name: "Nicos", cuisine: "Mexican", priceRange: "$$$", neighborhood: "Azcapotzalco", description: "Traditional Mexican since 1957", website: "https://www.nicosmexico.mx" },
          { name: "Dulce Patria", cuisine: "Mexican", priceRange: "$$$", neighborhood: "Polanco", description: "Martha Ortiz's artful Mexican", website: "https://www.dulcepatriamexico.com" },
          { name: "Lorea", cuisine: "Mexican", priceRange: "$$$", neighborhood: "Roma Norte", description: "Tasting menu destination", website: "https://www.lorea.mx" },
        ]
      },
      {
        category: "Luxury",
        priceRange: "MXN $1,200+",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        restaurants: [
          { name: "Pujol", cuisine: "Mexican", priceRange: "$$$$", neighborhood: "Polanco", description: "World's 50 Best restaurant", website: "https://www.pujol.com.mx" },
          { name: "Quintonil", cuisine: "Mexican", priceRange: "$$$$", neighborhood: "Polanco", description: "Michelin-worthy Mexican", website: "https://www.quintonil.com" },
          { name: "Sartoria", cuisine: "Italian", priceRange: "$$$$", neighborhood: "Polanco", description: "Fine Italian dining", website: "https://www.sartoria.com.mx" },
          { name: "J by José Andrés", cuisine: "Spanish", priceRange: "$$$$", neighborhood: "Polanco", description: "José Andrés in CDMX", website: "https://www.jbyjoseandres.com" },
          { name: "Morimoto", cuisine: "Japanese", priceRange: "$$$$", neighborhood: "Polanco", description: "Iron Chef elegance", website: "https://www.morimotomexico.com" },
        ]
      }
    ]
  },
  {
    city: "Guadalajara",
    cityKey: "guadalajara",
    country: "Mexico",
    countryKey: "mexico",
    countryCode: "mx",
    categories: [
      {
        category: "Budget",
        priceRange: "MXN $80-250",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        restaurants: [
          { name: "La Chata", cuisine: "Mexican", priceRange: "$", neighborhood: "Centro", description: "Traditional Jalisco cuisine", website: "https://www.lachata.com.mx" },
          { name: "Birrieria Las 9 Esquinas", cuisine: "Birria", priceRange: "$", neighborhood: "Centro", description: "Legendary birria tacos", website: "https://www.birrieria9esquinas.com" },
          { name: "Karne Garibaldi", cuisine: "Mexican", priceRange: "$", neighborhood: "Multiple locations", description: "World's fastest service record", website: "https://www.karnegaribaldi.com.mx" },
          { name: "Mercado San Juan de Dios", cuisine: "Food Hall", priceRange: "$", neighborhood: "Centro", description: "Largest indoor market", website: "https://www.mercadosanjuandedios.com" },
          { name: "Tortas Ahogadas El Rika", cuisine: "Sandwiches", priceRange: "$", neighborhood: "Centro", description: "Iconic drowned sandwiches", website: "https://www.tortasahogadaselrika.com" },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "MXN $250-500",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        restaurants: [
          { name: "Casa Bariachi", cuisine: "Mexican", priceRange: "$$", neighborhood: "Tlaquepaque", description: "Mariachi and Mexican classics", website: "https://www.casabariachi.com" },
          { name: "La Tequila", cuisine: "Mexican", priceRange: "$$", neighborhood: "Colonias", description: "Upscale Mexican cuisine", website: "https://www.latequila.com" },
          { name: "Corazon de Alcachofa", cuisine: "Mexican", priceRange: "$$", neighborhood: "Chapultepec", description: "Creative Mexican dining", website: "https://www.corazondealcachofa.com" },
          { name: "Santo Coyote", cuisine: "Mexican", priceRange: "$$", neighborhood: "Zona Rosa", description: "Theatrical Mexican dining", website: "https://www.santocoyote.com" },
          { name: "I Latina", cuisine: "Latin Fusion", priceRange: "$$", neighborhood: "Providencia", description: "Pan-Latin flavors", website: "https://www.ilatina.com.mx" },
        ]
      },
      {
        category: "Upscale",
        priceRange: "MXN $500-1,000",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        restaurants: [
          { name: "Hueso", cuisine: "Contemporary", priceRange: "$$$", neighborhood: "Lafayette", description: "All-white bone-themed restaurant", website: "https://www.hfranco.mx" },
          { name: "Alcalde", cuisine: "Mexican", priceRange: "$$$", neighborhood: "Chapultepec", description: "Modern Jalisco cuisine", website: "https://www.alcalde.mx" },
          { name: "HA", cuisine: "Japanese-Mexican", priceRange: "$$$", neighborhood: "Americana", description: "Nikkei fusion", website: "https://www.harestaurante.com" },
          { name: "Allium", cuisine: "Contemporary", priceRange: "$$$", neighborhood: "Americana", description: "Tasting menu dining", website: "https://www.alliumgdl.com" },
          { name: "Xokol", cuisine: "Mexican", priceRange: "$$$", neighborhood: "Tlaquepaque", description: "Pre-Hispanic inspired", website: "https://www.xokolrestaurante.com" },
        ]
      },
      {
        category: "Luxury",
        priceRange: "MXN $1,000+",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        restaurants: [
          { name: "Animalon", cuisine: "Contemporary", priceRange: "$$$$", neighborhood: "Providencia", description: "Creative fine dining", website: "https://www.animalon.mx" },
          { name: "Lula Bistro", cuisine: "Mexican", priceRange: "$$$$", neighborhood: "Lafayette", description: "Elegant Mexican cuisine", website: "https://www.lulabistro.com" },
          { name: "Trasfonda", cuisine: "Mexican", priceRange: "$$$$", neighborhood: "Americana", description: "Hidden tasting room", website: "https://www.trasfonda.mx" },
          { name: "Bruna", cuisine: "Italian", priceRange: "$$$$", neighborhood: "Providencia", description: "Upscale Italian dining", website: "https://www.bruna.mx" },
          { name: "Teocintle", cuisine: "Mexican", priceRange: "$$$$", neighborhood: "Providencia", description: "Modern Mexican mastery", website: "https://www.teocintlegdl.com" },
        ]
      }
    ]
  },
  {
    city: "Monterrey",
    cityKey: "monterrey",
    country: "Mexico",
    countryKey: "mexico",
    countryCode: "mx",
    categories: [
      {
        category: "Budget",
        priceRange: "MXN $80-250",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        restaurants: [
          { name: "El Gran Pastor", cuisine: "Tacos", priceRange: "$", neighborhood: "Centro", description: "Famous tacos al pastor", website: "https://www.elgranpastor.com.mx" },
          { name: "La Catarina", cuisine: "Mexican", priceRange: "$", neighborhood: "San Pedro", description: "Traditional Nuevo Leon food", website: "https://www.lacatarina.com.mx" },
          { name: "Tacos El Pipiripau", cuisine: "Tacos", priceRange: "$", neighborhood: "Multiple locations", description: "Local taco favorite", website: "https://www.elpipiripau.com" },
          { name: "El Rey del Cabrito", cuisine: "Mexican", priceRange: "$", neighborhood: "Centro", description: "Famous cabrito since 1960", website: "https://www.elreydelcabrito.com" },
          { name: "Mercado Barrio Antiguo", cuisine: "Food Hall", priceRange: "$", neighborhood: "Barrio Antiguo", description: "Hip market dining", website: "https://www.mercadobarrioantiguo.com" },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "MXN $250-500",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        restaurants: [
          { name: "Pangea", cuisine: "Mexican", priceRange: "$$", neighborhood: "San Pedro", description: "Modern Mexican cuisine", website: "https://www.pangea.com.mx" },
          { name: "La Nacional", cuisine: "Mexican", priceRange: "$$", neighborhood: "Centro", description: "Traditional Regiomontano", website: "https://www.lanacional.com.mx" },
          { name: "Manzanilla", cuisine: "Spanish", priceRange: "$$", neighborhood: "San Pedro", description: "Spanish tapas bar", website: "https://www.manzanilla.com.mx" },
          { name: "Soy Armando", cuisine: "Mexican", priceRange: "$$", neighborhood: "San Pedro", description: "Contemporary Mexican", website: "https://www.soyarmando.com" },
          { name: "Treviño", cuisine: "Steakhouse", priceRange: "$$", neighborhood: "San Pedro", description: "Northern Mexican steaks", website: "https://www.trevino.com.mx" },
        ]
      },
      {
        category: "Upscale",
        priceRange: "MXN $500-1,000",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        restaurants: [
          { name: "Origen", cuisine: "Mexican", priceRange: "$$$", neighborhood: "Centro", description: "Creative Mexican tasting", website: "https://www.origen.mx" },
          { name: "De La O", cuisine: "Mexican", priceRange: "$$$", neighborhood: "San Pedro", description: "Refined Mexican flavors", website: "https://www.delaomty.com" },
          { name: "Sonora Grill", cuisine: "Steakhouse", priceRange: "$$$", neighborhood: "San Pedro", description: "Premium Sonoran beef", website: "https://www.sonoragrill.com.mx" },
          { name: "Hacienda Los Morales", cuisine: "Mexican", priceRange: "$$$", neighborhood: "San Pedro", description: "Historic hacienda dining", website: "https://www.haciendalosmorales.com.mx" },
          { name: "Nobu", cuisine: "Japanese", priceRange: "$$$", neighborhood: "San Pedro", description: "World-famous Japanese", website: "https://www.noburestaurants.com" },
        ]
      },
      {
        category: "Luxury",
        priceRange: "MXN $1,000+",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        restaurants: [
          { name: "Roberto's", cuisine: "Steakhouse", priceRange: "$$$$", neighborhood: "Centro", description: "Premium steakhouse", website: "https://www.robertos.com.mx" },
          { name: "La Valenciana", cuisine: "Spanish", priceRange: "$$$$", neighborhood: "San Pedro", description: "Upscale Spanish cuisine", website: "https://www.lavalenciana.com.mx" },
          { name: "Nour", cuisine: "Mediterranean", priceRange: "$$$$", neighborhood: "San Pedro", description: "Lebanese-Mediterranean luxury", website: "https://www.nour.com.mx" },
          { name: "Morton's", cuisine: "Steakhouse", priceRange: "$$$$", neighborhood: "Valle Oriente", description: "Classic American steakhouse", website: "https://www.mortons.com" },
          { name: "Café des Artistes", cuisine: "French", priceRange: "$$$$", neighborhood: "San Pedro", description: "Elegant French dining", website: "https://www.cafedesartistes.com.mx" },
        ]
      }
    ]
  }
];

export default function Dining() {
  const [selectedCity, setSelectedCity] = useState<CityDining | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Budget");
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const { t } = useTranslation();

  const getCategoryTranslation = (category: string): string => {
    const categoryMap: Record<string, string> = {
      "Budget": t("dining.priceCategories.budget"),
      "Mid-Range": t("dining.priceCategories.midRange"),
      "Upscale": t("dining.priceCategories.upscale"),
      "Luxury": t("dining.priceCategories.luxury"),
    };
    return categoryMap[category] || category;
  };

  const getCuisineTranslation = (cuisine: string): string => {
    const cuisineKey = cuisine
      .replace(/\s+/g, '')
      .replace(/\//g, '')
      .replace(/-/g, '');
    const translated = t(`dining.cuisines.${cuisineKey}`, { defaultValue: '' });
    return translated || cuisine;
  };

  const getDescriptionTranslation = (cityKey: string, restaurantName: string, originalDescription: string): string => {
    const normalizedCityKey = cityKey.toLowerCase();
    const nameKey = restaurantName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);
    const translated = t(`dining.descriptions.${normalizedCityKey}.${nameKey}`, { defaultValue: '' });
    return translated || originalDescription;
  };

  if (selectedCity) {
    return (
      <Layout pageTitle="nav.dining">
        <div className="pt-6 px-6 pb-24">
          <button 
            onClick={() => setSelectedCity(null)}
            className="flex items-center space-x-2 text-primary mb-6 hover:text-primary/80 transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 rtl-flip" />
            <span className="text-sm font-medium">{t("dining.backToCities")}</span>
          </button>

          <div className="bg-gradient-to-br from-orange-500/20 to-primary/10 border border-orange-500/20 rounded-2xl p-6 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/20 flex-shrink-0">
                <img 
                  src={`https://flagcdn.com/w160/${selectedCity.countryCode}.png`}
                  alt={`${t(`cities.countries.${selectedCity.countryKey}`)} flag`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-display font-bold text-white mb-1" data-testid="text-city-name">
                  {t(`cities.cityNames.${selectedCity.cityKey}`)}
                </h1>
                <p className="text-orange-400 font-medium text-sm">
                  <Utensils className="w-4 h-4 inline mr-1" />
                  {t("dining.subtitle")}
                </p>
              </div>
            </div>
          </div>

          {priceFilter && (
            <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">{t("dining.filterActive")}: </span>
                <span className={`text-sm font-medium ${
                  priceFilter === "Budget" ? "text-green-400" :
                  priceFilter === "Mid-Range" ? "text-blue-400" :
                  priceFilter === "Upscale" ? "text-purple-400" : "text-amber-400"
                }`}>{getCategoryTranslation(priceFilter)}</span>
              </div>
              <button 
                onClick={() => setPriceFilter(null)}
                className="text-xs text-primary hover:underline"
                data-testid="button-clear-filter-city"
              >
                {t("dining.showAll")}
              </button>
            </div>
          )}

          <div className="space-y-4">
            {selectedCity.categories
              .filter(category => !priceFilter || category.category === priceFilter)
              .map((category, catIndex) => (
              <div key={catIndex} className="bg-card border border-white/5 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  data-testid={`button-category-${category.category.toLowerCase()}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg ${category.bgColor} flex items-center justify-center border`}>
                      <DollarSign className={`w-5 h-5 ${category.color}`} />
                    </div>
                    <div className="text-left">
                      <h3 className={`font-bold ${category.color}`}>{getCategoryTranslation(category.category)}</h3>
                      <p className="text-xs text-muted-foreground">{category.priceRange} {t("dining.perPerson")}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform rtl-flip ${expandedCategory === category.category ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedCategory === category.category && (
                  <div className="px-4 pb-4 space-y-3">
                    {category.restaurants.map((restaurant, resIndex) => (
                      <a
                        key={resIndex}
                        href={restaurant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-background/50 border border-white/5 rounded-lg p-4 hover:border-orange-500/30 transition-colors group"
                        data-testid={`link-restaurant-${restaurant.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-white group-hover:text-orange-400 transition-colors flex items-center gap-2">
                              {restaurant.name}
                              <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs ${category.color} font-medium`}>{getCuisineTranslation(restaurant.cuisine)}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{restaurant.neighborhood}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-2">{getDescriptionTranslation(selectedCity.cityKey, restaurant.name, restaurant.description)}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("dining.disclaimer")}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="nav.dining">
      {/* Hero Section with Background Image */}
      <div className="relative overflow-hidden min-h-[380px]">
        <div 
          className="absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: `url(${diningHeroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-background" />
        
        <div className="relative pt-8 px-6 pb-24">
          <Link href="/home" className="flex items-center space-x-2 text-primary mb-4 hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-4 h-4 rtl-flip" />
            <span className="text-sm font-medium">{t("common.back", "Back")}</span>
          </Link>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 backdrop-blur-sm flex items-center justify-center border border-orange-400/30">
              <Utensils className="w-6 h-6 text-orange-300" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white drop-shadow-lg" data-testid="text-page-title">
                {t("dining.title")}
              </h1>
              <p className="text-sm text-gray-300">{t("dining.subtitle")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="grid grid-cols-4 gap-2 mb-6">
          <button
            onClick={() => {
              const newFilter = priceFilter === "Budget" ? null : "Budget";
              setPriceFilter(newFilter);
              if (newFilter) setExpandedCategory(newFilter);
            }}
            className={`rounded-lg p-2 text-center transition-all ${
              priceFilter === "Budget" 
                ? "bg-green-500/30 border-2 border-green-400 ring-2 ring-green-400/50" 
                : "bg-green-500/10 border border-green-500/20 hover:bg-green-500/20"
            }`}
            data-testid="button-filter-budget"
          >
            <span className="text-[10px] text-green-400 font-medium">{t("dining.priceCategories.budget")}</span>
          </button>
          <button
            onClick={() => {
              const newFilter = priceFilter === "Mid-Range" ? null : "Mid-Range";
              setPriceFilter(newFilter);
              if (newFilter) setExpandedCategory(newFilter);
            }}
            className={`rounded-lg p-2 text-center transition-all ${
              priceFilter === "Mid-Range" 
                ? "bg-blue-500/30 border-2 border-blue-400 ring-2 ring-blue-400/50" 
                : "bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20"
            }`}
            data-testid="button-filter-midrange"
          >
            <span className="text-[10px] text-blue-400 font-medium">{t("dining.priceCategories.midRange")}</span>
          </button>
          <button
            onClick={() => {
              const newFilter = priceFilter === "Upscale" ? null : "Upscale";
              setPriceFilter(newFilter);
              if (newFilter) setExpandedCategory(newFilter);
            }}
            className={`rounded-lg p-2 text-center transition-all ${
              priceFilter === "Upscale" 
                ? "bg-purple-500/30 border-2 border-purple-400 ring-2 ring-purple-400/50" 
                : "bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20"
            }`}
            data-testid="button-filter-upscale"
          >
            <span className="text-[10px] text-purple-400 font-medium">{t("dining.priceCategories.upscale")}</span>
          </button>
          <button
            onClick={() => {
              const newFilter = priceFilter === "Luxury" ? null : "Luxury";
              setPriceFilter(newFilter);
              if (newFilter) setExpandedCategory(newFilter);
            }}
            className={`rounded-lg p-2 text-center transition-all ${
              priceFilter === "Luxury" 
                ? "bg-amber-500/30 border-2 border-amber-400 ring-2 ring-amber-400/50" 
                : "bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20"
            }`}
            data-testid="button-filter-luxury"
          >
            <span className="text-[10px] text-amber-400 font-medium">{t("dining.priceCategories.luxury")}</span>
          </button>
        </div>
        {priceFilter && (
          <div className="text-center mb-4">
            <span className="text-xs text-muted-foreground">{t("dining.filterActive")}: </span>
            <span className={`text-xs font-medium ${
              priceFilter === "Budget" ? "text-green-400" :
              priceFilter === "Mid-Range" ? "text-blue-400" :
              priceFilter === "Upscale" ? "text-purple-400" : "text-amber-400"
            }`}>{getCategoryTranslation(priceFilter)}</span>
            <button 
              onClick={() => setPriceFilter(null)}
              className="ml-2 text-xs text-primary hover:underline"
              data-testid="button-clear-filter"
            >
              {t("dining.clearFilter")}
            </button>
          </div>
        )}
      </div>

      <div className="px-6 pb-24">
        <h2 className="text-lg font-display font-bold text-white mb-4">{t("dining.selectCity")}</h2>
        
        <div className="space-y-3">
          {diningData.map((city, index) => (
            <button
              key={index}
              onClick={() => setSelectedCity(city)}
              className="w-full bg-card border border-white/5 rounded-xl p-4 hover:border-orange-500/30 transition-all group text-left"
              data-testid={`button-dining-city-${city.countryCode}-${index}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <img 
                      src={`https://flagcdn.com/w80/${city.countryCode}.png`}
                      alt={`${t(`cities.countries.${city.countryKey}`)} flag`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors">{t(`cities.cityNames.${city.cityKey}`)}</h3>
                    <p className="text-sm text-muted-foreground">{t("dining.restaurantsCount")}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-400 transition-colors rtl-flip" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}