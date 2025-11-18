"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Share2, Download, MessageSquare, Filter, RotateCcw, TvMinimal, Columns3, MapPin, Landmark, Info, ArrowUpDown, Grid3X3 } from "lucide-react";
import BorderAnimation from "@/components/BorderAnimation";
import platformsData from "@/data/platforms.json";
import labels from "@/data/labels.json";

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
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);

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
    setSortBy("name");
    setCurrentPage(1);
    setItemsPerPage(30);
  };

  // Download CSV function
  const downloadCSV = () => {
    const headers = labels.csv.headers;
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
    const text = labels.share.text.replace("{url}", window.location.href);
    if (navigator.share) {
      navigator.share({
        title: "Transparency Portals",
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert(labels.share.copied);
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

  // Sort platforms
  const sortedPlatforms = useMemo(() => {
    return [...filteredPlatforms].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.Name.localeCompare(b.Name);
        case "type":
          return a.Type.localeCompare(b.Type);
        case "level":
          const levelOrder = { "Kommune": 1, "Land": 2, "EU": 3 };
          return (levelOrder[a.Level as keyof typeof levelOrder] || 4) - (levelOrder[b.Level as keyof typeof levelOrder] || 4);
        default:
          return 0;
      }
    });
  }, [filteredPlatforms, sortBy]);

  // Paginate platforms
  const paginatedPlatforms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedPlatforms.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedPlatforms, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedPlatforms.length / itemsPerPage);

  return (
    <>
      {/* Border Animations */}
      <BorderAnimation />

      {/* Fixed Top Bar */}
<div className="fixed top-0 left-0 right-0 bg-background/50 backdrop-blur-md z-50 shadow-lg shadow-black/4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="https://politiqs.eu" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/politiqs.png"
                alt="Politiqs Logo"
                className="h-15 w-auto select-none hover:scale-104 transition-transform"
                draggable="false"
              />
            </a>
            <span className="bg-slate-200 text-slate-700 text-xs px-3 py-1 rounded-full font-medium border border-slate-300 flex items-center gap-1" title="This is a beta version of the platform">
              <Info size={12} />
              Beta
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button
              onClick={sharePortals}
              variant="outline"
              className="rounded-none border-2 text-sm bg-foreground text-background
              hover:text-foreground hover:bg-background flex items-center gap-2"
            >
              <Share2 size={16} />
              {labels.buttons.share}
            </Button>
            <Button
              onClick={downloadCSV}
              variant="outline"
             className="rounded-none border-2 text-sm bg-foreground text-background
              hover:text-foreground hover:bg-background flex items-center gap-2"
            >
              <Download size={16} />
              {labels.buttons.download}
            </Button>
            <Button
              onClick={suggestEdit}
              variant="outline"
                 className="rounded-none border-2 text-sm bg-foreground text-background
              hover:text-foreground hover:bg-background flex items-center gap-2"
            >
              <MessageSquare size={16} />
              {labels.buttons.suggest}
            </Button>
          </div>
        </div>
      </div>

<main className="min-h-screen bg-[radial-gradient(circle,_white_0%,_white_55%,_#f1f5f9_100%)] bg-fixed px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">

        <div className="max-w-7xl mx-auto py-8">
          {/* Header - Description section */}
       

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="mb-0 space-y-0 relative bg-background">
            <Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder={labels.search.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-base rounded-none border-2 h-12 pl-12"
            />
            
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0">
  <Select value={typeFilter} onValueChange={setTypeFilter}>
    <SelectTrigger className="w-full rounded-none border-2">
      <div className="flex items-center gap-2">
        <TvMinimal size={16} />
        <SelectValue placeholder={labels.filters.type.placeholder} />
      </div>
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">{labels.filters.type.all}</SelectItem>
      {types.map(type => (
        <SelectItem key={type} value={type}>{type}</SelectItem>
      ))}
    </SelectContent>
  </Select>

  <Select value={themeFilter} onValueChange={setThemeFilter}>
    <SelectTrigger className="w-full rounded-none border-2">
      <div className="flex items-center gap-2">
        <Columns3 size={16} />
        <SelectValue placeholder={labels.filters.theme.placeholder} />
      </div>
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">{labels.filters.theme.all}</SelectItem>
      {themes.map(theme => (
        <SelectItem key={theme} value={theme}>{theme}</SelectItem>
      ))}
    </SelectContent>
  </Select>

  <Select value={regionFilter} onValueChange={setRegionFilter}>
    <SelectTrigger className="w-full rounded-none border-2">
      <div className="flex items-center gap-2">
        <MapPin size={16} />
        <SelectValue placeholder={labels.filters.region.placeholder} />
      </div>
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">{labels.filters.region.all}</SelectItem>
      {regions.map(region => (
        <SelectItem key={region} value={region}>{region}</SelectItem>
      ))}
    </SelectContent>
  </Select>

  <Select value={levelFilter} onValueChange={setLevelFilter}>
    <SelectTrigger className="w-full rounded-none border-2">
      <div className="flex items-center gap-2">
        <Landmark size={16} />
        <SelectValue placeholder={labels.filters.level.placeholder} />
      </div>
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">{labels.filters.level.all}</SelectItem>
      {levels.map(level => (
        <SelectItem key={level} value={level}>{level}</SelectItem>
      ))}
    </SelectContent>
  </Select>

  <Button
    onClick={resetFilters}
    variant="outline"
    className="w-full rounded-none border-2 border-border hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-2"
  >
    <RotateCcw size={16} />
    <span className="hidden sm:inline">{labels.filters.reset.text}</span>
    <span className="sm:hidden">{labels.filters.reset.short}</span>
  </Button>
</div>
            </div>


            <div className="mt-4 flex items-center justify-between shadow-none">
              <div className="text-sm text-muted-foreground shadow-none">
                {labels.results.showing.replace("{count}", paginatedPlatforms.length.toString()).replace("{total}", sortedPlatforms.length.toString())}
              </div>
              <div className="flex items-center gap-2">
                <Select value={itemsPerPage.toString()} onValueChange={(value) => { setItemsPerPage(parseInt(value)); setCurrentPage(1); }}>
                  <SelectTrigger className="w-32 rounded-none border-none shadow-none">
                    <div className="flex items-center gap-2">
                      <Grid3X3 size={16} />
                      <SelectValue placeholder="Pro Seite" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                    <SelectItem value="90">90</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value) => { setSortBy(value); setCurrentPage(1); }}>
                  <SelectTrigger className="w-48 rounded-none border-none shadow-none">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown size={16} />
                      <SelectValue placeholder="Sortieren" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nach Name</SelectItem>
                    <SelectItem value="type">Nach Typ</SelectItem>
                    <SelectItem value="level">Nach Ebene</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Portal Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {paginatedPlatforms.length === 0 ? (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                {labels.results.none}
              </div>
            ) : (
              paginatedPlatforms.map((platform, index) => (
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
                          {labels.cards.learnMore}
                        </div>
                      </div>

                      {/* Back Face */}
                      <div className="absolute inset-0 w-full h-full backface-hidden bg-foreground text-background p-6 flex flex-col justify-between rotate-y-180">
                        <div>
                          <p className="text-sm leading-relaxed mb-4 opacity-90">
                            {platform.Description}
                          </p>
                          <div className="text-xs opacity-75">
                            <span className="font-semibold">{labels.cards.foundedBy}</span> {platform.Founders}
                          </div>
                        </div>
                        <div className="text-sm font-medium opacity-90">
                          {labels.cards.visit}
                        </div>
                      </div>
                    </div>
                  </Card>
                </a>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="rounded-none border-2"
              >
                Vorherige
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (page > totalPages) return null;
                  return (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      className="rounded-none border-2 w-10 h-10"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
                className="rounded-none border-2"
              >
                Nächste
              </Button>
            </div>
          )}

        </div>
      </main>
      <footer className="bg-foreground text-background mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="font-bold mb-2">{labels.footer.impressum.title}</h3>
              <p className="opacity-80">
                {labels.footer.impressum.content.split('\n').map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">{labels.footer.legal.title}</h3>
              <p className="opacity-80">
                {labels.footer.legal.content}<br />
                <a href="https://github.com/polit-iqs/platforms" className="underline hover:opacity-60 transition-opacity">
                  {labels.footer.legal.link}
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">{labels.footer.copyright.title}</h3>
              <p className="opacity-80">
                {labels.footer.copyright.content.split('\n').map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </p>
            </div>
          </div>
          <div className="border-t border-background/20 mt-8 pt-8 text-xs opacity-60 text-center">
            <p>{labels.footer.disclaimer}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
