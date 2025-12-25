import { Layout } from "@/components/Layout";
import { Globe, MapPin, Users, ExternalLink, Search, Plus, X, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFlagUrlByCode } from "@/lib/flags";
import { globalWatchHubs } from "@/data/globalWatchHubs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const hostCities = [
  { key: "kansasCity", name: "Kansas City, USA" },
  { key: "newYork", name: "New York/New Jersey, USA" },
  { key: "losAngeles", name: "Los Angeles, USA" },
  { key: "dallas", name: "Dallas, USA" },
  { key: "miami", name: "Miami, USA" },
  { key: "atlanta", name: "Atlanta, USA" },
  { key: "seattle", name: "Seattle, USA" },
  { key: "sanFrancisco", name: "San Francisco Bay Area, USA" },
  { key: "houston", name: "Houston, USA" },
  { key: "philadelphia", name: "Philadelphia, USA" },
  { key: "boston", name: "Boston, USA" },
  { key: "toronto", name: "Toronto, Canada" },
  { key: "vancouver", name: "Vancouver, Canada" },
  { key: "mexicoCity", name: "Mexico City, Mexico" },
  { key: "guadalajara", name: "Guadalajara, Mexico" },
  { key: "monterrey", name: "Monterrey, Mexico" },
];

const venueTypes = [
  { value: "bar", label: "Sports Bar" },
  { value: "fan_zone", label: "Fan Zone / Festival" },
  { value: "stadium", label: "Stadium / Arena" },
  { value: "restaurant", label: "Restaurant" },
  { value: "public_space", label: "Public Viewing Space" },
];

export default function WatchHubs() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [formData, setFormData] = useState({
    countryCode: "",
    countryName: "",
    city: "",
    venueName: "",
    venueType: "bar",
    address: "",
    capacity: "",
    mapsUrl: "",
    website: "",
    phone: "",
    description: "",
    isHostCity: 0 as number,
    hostCityKey: "",
    submitterName: "",
    submitterEmail: "",
  });

  const { data: crowdsourcedVenues = [] } = useQuery({
    queryKey: ["/api/watch-hubs/venues"],
    queryFn: async () => {
      const res = await fetch("/api/watch-hubs/venues");
      if (!res.ok) throw new Error("Failed to fetch venues");
      return res.json();
    },
  });

  const submitVenue = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/watch-hubs/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Submission failed");
      }
      return res.json();
    },
    onSuccess: () => {
      setSubmissionSuccess(true);
      setFormData({
        countryCode: "", countryName: "", city: "", venueName: "", venueType: "bar",
        address: "", capacity: "", mapsUrl: "", website: "", phone: "", description: "",
        isHostCity: 0, hostCityKey: "", submitterName: "", submitterEmail: "",
      });
      setTimeout(() => {
        setIsDialogOpen(false);
        setSubmissionSuccess(false);
      }, 2000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitVenue.mutate(formData);
  };

  const filteredHubs = globalWatchHubs.filter(
    (hub) =>
      hub.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hub.primaryCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const continentKeys = ["europe", "southAmerica", "northAmerica", "africa", "asia", "oceania"] as const;
  
  const groupByContinent = (hubs: typeof globalWatchHubs) => {
    const continents: Record<string, typeof globalWatchHubs> = {
      "europe": [],
      "southAmerica": [],
      "northAmerica": [],
      "africa": [],
      "asia": [],
      "oceania": []
    };

    const continentMap: Record<string, string> = {
      AR: "southAmerica", AU: "oceania", AT: "europe", BE: "europe", BR: "southAmerica",
      CM: "africa", CA: "northAmerica", CL: "southAmerica", CO: "southAmerica", HR: "europe",
      CZ: "europe", DK: "europe", EC: "southAmerica", EG: "africa", GB: "europe",
      FR: "europe", DE: "europe", HU: "europe", IR: "asia", IT: "europe",
      JP: "asia", KR: "asia", MX: "northAmerica", MA: "africa", NL: "europe",
      NG: "africa", PY: "southAmerica", PE: "southAmerica", PL: "europe", PT: "europe",
      QA: "asia", SA: "asia", RS: "europe", SN: "africa", SI: "europe",
      ZA: "africa", ES: "europe", CH: "europe", TN: "africa", TR: "europe",
      UA: "europe", US: "northAmerica", UY: "southAmerica", UZ: "asia", VE: "southAmerica",
      "GB-WLS": "europe", DZ: "africa", "GB-SCT": "europe"
    };

    hubs.forEach((hub) => {
      const continent = continentMap[hub.countryCode] || "europe";
      continents[continent].push(hub);
    });

    return continents;
  };

  const groupedHubs = groupByContinent(filteredHubs);

  return (
    <Layout pageTitle="watchHubs.title">
      <div className="px-6 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              {t("watchHubs.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("watchHubs.subtitle")}
            </p>
          </div>
        </div>

        <div className="relative mt-6 mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("watchHubs.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="bg-card/50 border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-bold text-white">{t("watchHubs.infoTitle")}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("watchHubs.infoDescription")}
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-6 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Suggest a Watch Party Venue
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-card">
            <DialogHeader>
              <DialogTitle className="text-white">Suggest a Watch Party Venue</DialogTitle>
            </DialogHeader>
            
            {submissionSuccess ? (
              <div className="flex flex-col items-center py-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <p className="text-white font-medium text-center">Thank you!</p>
                <p className="text-muted-foreground text-sm text-center">Your venue submission is pending review.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Venue Type *</Label>
                  <div className="flex gap-2 flex-wrap">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="venueCategory"
                        checked={formData.isHostCity === 0}
                        onChange={() => setFormData(prev => ({ ...prev, isHostCity: 0, hostCityKey: "" }))}
                        className="accent-primary"
                      />
                      <span className="text-sm text-muted-foreground">Country Fan Zone</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="venueCategory"
                        checked={formData.isHostCity === 1}
                        onChange={() => setFormData(prev => ({ ...prev, isHostCity: 1 }))}
                        className="accent-primary"
                      />
                      <span className="text-sm text-muted-foreground">Host City Watch Party</span>
                    </label>
                  </div>
                </div>

                {formData.isHostCity === 1 && (
                  <div className="space-y-2">
                    <Label className="text-white">Host City *</Label>
                    <Select
                      value={formData.hostCityKey}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, hostCityKey: value }))}
                    >
                      <SelectTrigger className="bg-background border-white/10">
                        <SelectValue placeholder="Select host city" />
                      </SelectTrigger>
                      <SelectContent>
                        {hostCities.map(city => (
                          <SelectItem key={city.key} value={city.key}>{city.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.isHostCity === 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-white">Country Code *</Label>
                      <Input
                        placeholder="US, BR, FR..."
                        value={formData.countryCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value.toUpperCase() }))}
                        className="bg-background border-white/10"
                        required={formData.isHostCity === 0}
                        maxLength={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Country Name *</Label>
                      <Input
                        placeholder="United States"
                        value={formData.countryName}
                        onChange={(e) => setFormData(prev => ({ ...prev, countryName: e.target.value }))}
                        className="bg-background border-white/10"
                        required={formData.isHostCity === 0}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-white">City *</Label>
                  <Input
                    placeholder="City name"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="bg-background border-white/10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Venue Name *</Label>
                  <Input
                    placeholder="Stadium, bar, or venue name"
                    value={formData.venueName}
                    onChange={(e) => setFormData(prev => ({ ...prev, venueName: e.target.value }))}
                    className="bg-background border-white/10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Venue Type *</Label>
                  <Select
                    value={formData.venueType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, venueType: value }))}
                  >
                    <SelectTrigger className="bg-background border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {venueTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-white">Capacity</Label>
                    <Input
                      placeholder="500"
                      value={formData.capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                      className="bg-background border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Phone</Label>
                    <Input
                      placeholder="+1 555-1234"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-background border-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Address</Label>
                  <Input
                    placeholder="Street address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="bg-background border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Google Maps URL</Label>
                  <Input
                    placeholder="https://maps.google.com/..."
                    value={formData.mapsUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, mapsUrl: e.target.value }))}
                    className="bg-background border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Website</Label>
                  <Input
                    placeholder="https://..."
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="bg-background border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Description</Label>
                  <Textarea
                    placeholder="Brief description of the venue..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-background border-white/10"
                    rows={2}
                  />
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs text-muted-foreground mb-3">Your contact info (for verification only)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-white">Your Name *</Label>
                      <Input
                        placeholder="Your name"
                        value={formData.submitterName}
                        onChange={(e) => setFormData(prev => ({ ...prev, submitterName: e.target.value }))}
                        className="bg-background border-white/10"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Your Email *</Label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.submitterEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, submitterEmail: e.target.value }))}
                        className="bg-background border-white/10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={submitVenue.isPending}
                >
                  {submitVenue.isPending ? "Submitting..." : "Submit Venue"}
                </Button>

                {submitVenue.isError && (
                  <p className="text-red-500 text-sm text-center">
                    {submitVenue.error?.message || "Submission failed. Please try again."}
                  </p>
                )}
              </form>
            )}
          </DialogContent>
        </Dialog>

        {Object.entries(groupedHubs).map(([continentKey, hubs]) => 
          hubs.length > 0 && (
            <div key={continentKey} className="mb-8">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {t(`watchHubs.continents.${continentKey}`)}
                <span className="text-sm font-normal text-muted-foreground">({hubs.length} {t("watchHubs.countries")})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hubs.map((hub) => (
                  <div
                    key={hub.countryCode}
                    className="bg-card border border-white/10 rounded-xl p-4 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={getFlagUrlByCode(hub.countryCode.split('-')[0].toLowerCase())}
                        alt={hub.countryName}
                        className="w-10 h-7 rounded object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-white">{hub.countryName}</h3>
                        <p className="text-xs text-muted-foreground">{hub.primaryCity}</p>
                      </div>
                    </div>
                    {hub.venues.map((venue, idx) => (
                      <a
                        key={idx}
                        href={venue.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-background/50 rounded-lg p-3 hover:bg-primary/10 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{venue.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {venue.city} - {t("watchHubs.capacity")}: {venue.capacity}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-primary" />
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {filteredHubs.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("watchHubs.noResults")}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
