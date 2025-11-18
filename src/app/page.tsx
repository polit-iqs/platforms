"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Share2, Download, MessageSquare, Filter, RotateCcw, TvMinimal, Columns3, MapPin, Landmark } from "lucide-react";
import BorderAnimation from "@/components/BorderAnimation";
import platformsData from "@/data/platforms.json";

interface Platform {
  Name: string;
  Link: string;
  Description: string;
  Founders: string;
  "LinkedIn Link": string;
  Type: string;
  Themes: string[];
  Regions: string[];
  Level: string;
}

const platforms: Platform[] = platformsData;

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  // Extract unique values from platforms data
  const types = useMemo(() => {
    const uniqueTypes = Array.from(new Set(platforms.map(p => p.Type)));
    return uniqueTypes.sort();
  }, []);

  const themes = useMemo(() => {
    const allThemes = platforms.flatMap(p => p.Themes);
    const uniqueThemes = Array.from(new Set(allThemes));
    return uniqueThemes.sort();
  }, []);

  const regions = useMemo(() => {
    const allRegions = platforms.flatMap(p => p.Regions);
    const uniqueRegions = Array.from(new Set(allRegions));
    return uniqueRegions.sort();
  }, []);

  const levels = useMemo(() => {
    const uniqueLevels = Array.from(new Set(platforms.map(p => p.Level)));
    return uniqueLevels.sort();
  }, []);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setThemeFilter("all");
    setRegionFilter("all");
    setLevelFilter("all");
  };

  // Download CSV function
  const downloadCSV = () => {
    const headers = ["Name", "Type", "Link", "Description", "Themes", "Regions", "Level"];
    const csvContent = [
      headers.join(","),
      ...filteredPlatforms.map(p =>
        [
          `"${p.Name}"`,
          `"${p.Type}"`,
          `"${p.Link}"`,
          `"${p.Description}"`,
          `"${p.Themes.join("; ")}"`,
          `"${p.Regions.join("; ")}"`,
          `"${p.Level}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transparency-portals.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Share function
  const sharePortals = () => {
    const text = `Check out these transparency portals: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: "Transparency Portals",
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert("Link copied to clipboard!");
    }
  };

  // Suggest Edit function
  const suggestEdit = () => {
    window.open(
      "https://github.com/polit-iqs/platforms/issues/new",
      "_blank"
    );
  };

  // Filter platforms
  const filteredPlatforms = useMemo(() => {
    return platforms.filter(platform => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        platform.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        platform.Description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        platform.Type.toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter
      const matchesType = typeFilter === "all" || platform.Type === typeFilter;

      // Theme filter
      const matchesTheme = themeFilter === "all" || platform.Themes.includes(themeFilter);

      // Region filter
      const matchesRegion = regionFilter === "all" || platform.Regions.includes(regionFilter);

      // Level filter
      const matchesLevel = levelFilter === "all" || platform.Level === levelFilter;

      return matchesSearch && matchesType && matchesTheme && matchesRegion && matchesLevel;
    });
  }, [searchQuery, typeFilter, themeFilter, regionFilter, levelFilter]);

  return (
    <>
      {/* Border Animations */}
      <BorderAnimation />

      {/* Fixed Top Bar */}
<div className="fixed top-0 left-0 right-0 bg-background/50 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/images/politiqs.png"
              alt="Politiqs Logo"
              className="h-15 w-auto select-none hover:scale-104 transition-transform"
              draggable="false"
            />
        
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button
              onClick={sharePortals}
              variant="outline"
              className="rounded-none border-2 text-sm bg-foreground text-background
              hover:text-foreground hover:bg-background flex items-center gap-2"
            >
              <Share2 size={16} />
              Teilen
            </Button>
            <Button
              onClick={downloadCSV}
              variant="outline"
             className="rounded-none border-2 text-sm bg-foreground text-background
              hover:text-foreground hover:bg-background flex items-center gap-2"
            >
              <Download size={16} />
              CSV herunterladen
            </Button>
            <Button
              onClick={suggestEdit}
              variant="outline"
                 className="rounded-none border-2 text-sm bg-foreground text-background
              hover:text-foreground hover:bg-background flex items-center gap-2"
            >
              <MessageSquare size={16} />
              Portal ergänzen
            </Button>
          </div>
        </div>
      </div>

<main className="min-h-screen bg-[radial-gradient(circle,_white_0%,_white_55%,_#f1f5f9_100%)] px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">

        <div className="max-w-7xl mx-auto py-8">
          {/* Header - Description section */}
       

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="mb-0 space-y-0 relative bg-background">
            <Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder="Suche Portale..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-base rounded-none border-2 h-12 pl-12"
            />
            
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0">
  <Select value={typeFilter} onValueChange={setTypeFilter}>
    <SelectTrigger className="w-full rounded-none border-2">
      <div className="flex items-center gap-2">
        <TvMinimal size={16} />
        <SelectValue placeholder="Type" />
      </div>
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Alle Arten</SelectItem>
      {types.map(type => (
        <SelectItem key={type} value={type}>{type}</SelectItem>
      ))}
    </SelectContent>
  </Select>

  <Select value={themeFilter} onValueChange={setThemeFilter}>
    <SelectTrigger className="w-full rounded-none border-2">
      <div className="flex items-center gap-2">
        <Columns3 size={16} />
        <SelectValue placeholder="Theme" />
      </div>
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Alle Themen</SelectItem>
      {themes.map(theme => (
        <SelectItem key={theme} value={theme}>{theme}</SelectItem>
      ))}
    </SelectContent>
  </Select>

  <Select value={regionFilter} onValueChange={setRegionFilter}>
    <SelectTrigger className="w-full rounded-none border-2">
      <div className="flex items-center gap-2">
        <MapPin size={16} />
        <SelectValue placeholder="Region" />
      </div>
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Alle Regionen</SelectItem>
      {regions.map(region => (
        <SelectItem key={region} value={region}>{region}</SelectItem>
      ))}
    </SelectContent>
  </Select>

  <Select value={levelFilter} onValueChange={setLevelFilter}>
    <SelectTrigger className="w-full rounded-none border-2">
      <div className="flex items-center gap-2">
        <Landmark size={16} />
        <SelectValue placeholder="Level" />
      </div>
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Alle Ebenen</SelectItem>
      {levels.map(level => (
        <SelectItem key={level} value={level}>{level}</SelectItem>
      ))}
    </SelectContent>
  </Select>

  <Button
    onClick={resetFilters}
    variant="outline"
    className="w-full rounded-none border-2 hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-2"
  >
    <RotateCcw size={16} />
    <span className="hidden sm:inline">Filter zurücksetzen</span>
    <span className="sm:hidden">Reset</span>
  </Button>
</div>
            </div>


            <div className="mt-4 text-sm text-muted-foreground">
              Zeige {filteredPlatforms.length} von {platforms.length} Portalen
            </div>
          </div>

          {/* Portal Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {filteredPlatforms.length === 0 ? (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                Keine Portale gefunden, die deinen Filtern entsprechen.
              </div>
            ) : (
              filteredPlatforms.map((platform, index) => (
                <a
                  key={index}
                  href={platform.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="h-[280px] relative overflow-hidden border-2 border-border hover:border-foreground transition-all duration-300 cursor-pointer perspective-1000 p-0 rounded-none">
                    {/* Card Inner - Flip Container */}
                    <div className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-180">
                      {/* Front Face */}
                      <div className="absolute inset-0 w-full h-full backface-hidden bg-card p-6 flex flex-col justify-between">
                        <div>
                          <div className="inline-block px-3 py-1 bg-foreground text-background text-xs font-medium rounded-none mb-4">
                            {platform.Type}
                          </div>
                          <h2 className="text-2xl font-bold text-foreground mb-3 leading-tight">
                            {platform.Name}
                          </h2>
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">
                          Mehr erfahren →
                        </div>
                      </div>

                      {/* Back Face */}
                      <div className="absolute inset-0 w-full h-full backface-hidden bg-foreground text-background p-6 flex flex-col justify-between rotate-y-180">
                        <div>
                          <p className="text-sm leading-relaxed mb-4 opacity-90">
                            {platform.Description}
                          </p>
                          <div className="text-xs opacity-75">
                            <span className="font-semibold">Gegründet von:</span> {platform.Founders}
                          </div>
                        </div>
                        <div className="text-sm font-medium opacity-90">
                          Zum Portal →
                        </div>
                      </div>
                    </div>
                  </Card>
                </a>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
