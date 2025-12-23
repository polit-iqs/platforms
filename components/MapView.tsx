"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, X } from "lucide-react";

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

interface MapViewProps {
  platforms: Platform[];
  starred: string[];
  toggleStar: (name: string) => void;
}

interface EuropeCountry {
  name: string;
  code: string;
  path: string;
}

// European countries with interlocking puzzle-piece paths (no overlaps)
// ViewBox is 1000 x 700 for precise alignment
const europeCountries: EuropeCountry[] = [
  // Far North - Atlantic Islands
  { name: "Iceland", code: "IS", path: "M50,80 L120,90 L125,160 L55,150 Z" },
  { name: "Faroe Islands", code: "FO", path: "M130,70 L160,75 L162,120 L132,115 Z" },
  
  // British Isles
  { name: "Ireland", code: "IE", path: "M140,160 L190,170 L192,340 L142,330 Z" },
  { name: "United Kingdom", code: "GB", path: "M190,140 L260,155 L262,340 L192,330 Z" },
  
  // Scandinavia
  { name: "Norway", code: "NO", path: "M260,50 L320,70 L310,250 L250,210 Z" },
  { name: "Sweden", code: "SE", path: "M320,60 L380,80 L375,260 L310,250 Z" },
  { name: "Finland", code: "FI", path: "M380,70 L460,90 L455,270 L375,260 Z" },
  { name: "Denmark", code: "DK", path: "M300,250 L340,260 L340,310 L300,300 Z" },
  
  // Baltic States
  { name: "Estonia", code: "EE", path: "M455,270 L510,285 L508,330 L453,315 Z" },
  { name: "Latvia", code: "LV", path: "M455,330 L510,345 L508,390 L453,375 Z" },
  { name: "Lithuania", code: "LT", path: "M455,390 L510,410 L508,450 L453,430 Z" },
  
  // Western Europe
  { name: "Netherlands", code: "NL", path: "M300,300 L340,310 L340,360 L300,350 Z" },
  { name: "Belgium", code: "BE", path: "M340,310 L380,320 L380,365 L340,355 Z" },
  { name: "Luxembourg", code: "LU", path: "M365,355 L385,362 L385,375 L365,368 Z" },
  { name: "France", code: "FR", path: "M260,340 L380,360 L385,520 L260,500 Z" },
  
  // Germany & Central Europe
  { name: "Germany", code: "DE", path: "M340,310 L430,330 L430,410 L340,390 Z" },
  { name: "Poland", code: "PL", path: "M430,310 L530,340 L528,440 L428,410 Z" },
  { name: "Czech Republic", code: "CZ", path: "M395,390 L430,405 L430,445 L395,430 Z" },
  { name: "Slovakia", code: "SK", path: "M430,440 L510,460 L510,495 L430,475 Z" },
  { name: "Austria", code: "AT", path: "M395,430 L450,450 L450,490 L395,470 Z" },
  { name: "Switzerland", code: "CH", path: "M340,360 L395,375 L395,420 L340,405 Z" },
  { name: "Liechtenstein", code: "LI", path: "M385,395 L405,403 L405,425 L385,417 Z" },
  
  // Eastern Europe
  { name: "Belarus", code: "BY", path: "M530,330 L620,360 L620,450 L530,420 Z" },
  { name: "Ukraine", code: "UA", path: "M530,450 L650,480 L645,560 L530,530 Z" },
  { name: "Moldova", code: "MD", path: "M630,520 L680,540 L675,575 L630,555 Z" },
  { name: "Romania", code: "RO", path: "M540,490 L630,520 L630,580 L540,550 Z" },
  { name: "Russia (European part)", code: "RU", path: "M620,340 L800,380 L800,560 L650,530 Z" },
  
  // Balkans
  { name: "Hungary", code: "HU", path: "M450,490 L530,520 L530,560 L450,530 Z" },
  { name: "Slovenia", code: "SI", path: "M395,470 L450,490 L450,530 L395,510 Z" },
  { name: "Croatia", code: "HR", path: "M420,520 L520,550 L520,590 L420,560 Z" },
  { name: "Bosnia and Herzegovina", code: "BA", path: "M380,520 L420,540 L420,580 L380,560 Z" },
  { name: "Serbia", code: "RS", path: "M450,530 L530,560 L530,600 L450,570 Z" },
  { name: "Montenegro", code: "ME", path: "M420,580 L460,600 L460,620 L420,600 Z" },
  { name: "Kosovo", code: "XK", path: "M460,600 L510,620 L510,645 L460,625 Z" },
  { name: "North Macedonia", code: "MK", path: "M510,620 L560,640 L560,670 L510,650 Z" },
  { name: "Albania", code: "AL", path: "M420,600 L460,620 L460,660 L420,640 Z" },
  
  // Southern Europe
  { name: "Portugal", code: "PT", path: "M140,340 L190,350 L192,500 L142,490 Z" },
  { name: "Spain", code: "ES", path: "M190,340 L260,360 L260,520 L190,500 Z" },
  { name: "Andorra", code: "AD", path: "M260,350 L280,358 L280,375 L260,367 Z" },
  { name: "Italy", code: "IT", path: "M380,420 L450,440 L455,580 L380,560 Z" },
  { name: "Monaco", code: "MC", path: "M445,415 L455,420 L455,430 L445,425 Z" },
  { name: "San Marino", code: "SM", path: "M430,460 L445,470 L445,485 L430,475 Z" },
  { name: "Malta", code: "MT", path: "M500,590 L520,600 L520,620 L500,610 Z" },
  { name: "Greece", code: "GR", path: "M530,600 L630,640 L625,680 L530,660 Z" },
  { name: "Cyprus", code: "CY", path: "M680,600 L720,620 L720,650 L680,630 Z" },
  { name: "Turkey (European part)", code: "TR", path: "M630,640 L750,670 L745,690 L630,680 Z" },
];

// Map region names from data to country names
const regionToCountryMap: { [key: string]: string } = {
  "Deutschland": "Germany",
  "Österreich": "Austria",
  "Schweiz": "Switzerland",
  "Frankreich": "France",
  "Italien": "Italy",
  "Spanien": "Spain",
  "Niederlande": "Netherlands",
  "Belgien": "Belgium",
  "Polen": "Poland",
  "Tschechien": "Czech Republic",
  "Slowakei": "Slovakia",
  "Ungarn": "Hungary",
  "Rumänien": "Romania",
  "Bulgarien": "Bulgaria",
  "Griechenland": "Greece",
  "Portugal": "Portugal",
  "Schweden": "Sweden",
  "Norwegen": "Norway",
  "Finnland": "Finland",
  "Dänemark": "Denmark",
  "Irland": "Ireland",
  "Vereinigtes Königreich": "United Kingdom",
  "Kroatien": "Croatia",
  "Slowenien": "Slovenia",
  "Estland": "Estonia",
  "Lettland": "Latvia",
  "Litauen": "Lithuania",
  "Luxembourg": "Luxembourg",
};

export default function MapView({ platforms, starred, toggleStar }: MapViewProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Get platforms by country
  const platformsByCountry = useMemo(() => {
    const map: { [key: string]: Platform[] } = {};
    
    platforms.forEach(platform => {
      platform.Regions.forEach(region => {
        const countryName = regionToCountryMap[region];
        if (countryName) {
          if (!map[countryName]) {
            map[countryName] = [];
          }
          if (!map[countryName].includes(platform)) {
            map[countryName].push(platform);
          }
        }
      });
    });
    
    return map;
  }, [platforms]);

  // Get platforms for selected country
  const selectedPlatforms = useMemo(() => {
    if (!selectedCountry) return [];
    return platformsByCountry[selectedCountry] || [];
  }, [selectedCountry, platformsByCountry]);

  // Count platforms per country
  const countByCountry = useMemo(() => {
    const counts: { [key: string]: number } = {};
    Object.keys(platformsByCountry).forEach(country => {
      counts[country] = platformsByCountry[country].length;
    });
    return counts;
  }, [platformsByCountry]);

  const getCountryColor = (countryName: string) => {
    const count = countByCountry[countryName] || 0;
    
    if (hoveredCountry === countryName) {
      return "rgb(23, 23, 23)"; // black for hover
    }
    
    if (selectedCountry === countryName) {
      return "rgb(30, 41, 59)"; // slate-800
    }
    
    if (count === 0) {
      return "rgb(241, 245, 249)"; // slate-100 - light gray for no data
    }
    
    // Color scale based on number of platforms
    if (count > 10) return "rgb(71, 85, 105)"; // slate-700
    if (count > 5) return "rgb(100, 116, 139)"; // slate-600
    if (count > 2) return "rgb(148, 163, 184)"; // slate-400
    return "rgb(203, 213, 225)"; // slate-300
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map Section */}
      <div className="lg:col-span-2">
        <Card className="border-2 rounded-none">
          <CardContent className="p-6">
            {/* SVG Map */}
            <div className="bg-slate-50 border-2 border-border rounded-none mb-6">
              <svg
                viewBox="0 0 1000 700"
                className="w-full h-auto"
                style={{ minHeight: "500px" }}
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background */}
                <rect width="1000" height="700" fill="rgb(226, 232, 240)" />
                
                {/* Country shapes */}
                {europeCountries.map((country) => {
                  const count = countByCountry[country.name] || 0;
                  const hasData = count > 0;
                  const isSelected = selectedCountry === country.name;
                  const isHovered = hoveredCountry === country.name;
                  const fill = getCountryColor(country.name);
                  
                  return (
                    <g key={country.code}>
                      <path
                        d={country.path}
                        fill={fill}
                        stroke="rgb(255, 255, 255)"
                        strokeWidth="1.5"
                        style={{
                          cursor: hasData ? "pointer" : "default",
                          transition: "all 0.2s ease",
                          filter: isSelected ? "drop-shadow(0 0 4px rgba(0,0,0,0.5))" : "none",
                          opacity: isHovered ? 1 : 0.9,
                        }}
                        onMouseEnter={() => hasData && setHoveredCountry(country.name)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        onClick={() => {
                          if (hasData) {
                            setSelectedCountry(isSelected ? null : country.name);
                          }
                        }}
                      />
                      {/* Country label with count */}
                      {hasData && (
                        <text
                          x={(() => {
                            const matches = country.path.match(/[\d.]+/g) || [];
                            if (matches.length >= 2) {
                              const nums = matches.map(Number).filter((_, i) => i % 2 === 0);
                              return (Math.min(...nums) + Math.max(...nums)) / 2;
                            }
                            return 500;
                          })()}
                          y={(() => {
                            const matches = country.path.match(/[\d.]+/g) || [];
                            if (matches.length >= 2) {
                              const nums = matches.map(Number).filter((_, i) => i % 2 === 1);
                              return (Math.min(...nums) + Math.max(...nums)) / 2;
                            }
                            return 350;
                          })()}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="16"
                          fontWeight="bold"
                          fill="rgb(71, 85, 105)"
                          pointerEvents="none"
                        >
                          {count}
                        </text>
                      )}
                      {/* Tooltip on hover */}
                      <title>{`${country.name}: ${count} ${count === 1 ? "Portal" : "Portale"}`}</title>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-300" style={{ backgroundColor: "rgb(203, 213, 225)" }}></div>
                <span>1-2 Portale</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-300" style={{ backgroundColor: "rgb(148, 163, 184)" }}></div>
                <span>3-5 Portale</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-300" style={{ backgroundColor: "rgb(100, 116, 139)" }}></div>
                <span>6-10 Portale</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-300" style={{ backgroundColor: "rgb(71, 85, 105)" }}></div>
                <span>10+ Portale</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Side Panel */}
      <div className="lg:col-span-1">
        {selectedCountry ? (
          <Card className="border-2 rounded-none">
            <CardHeader className="flex flex-row items-center justify-between border-b-2">
              <CardTitle className="text-xl">{selectedCountry}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedCountry(null)}
                className="rounded-none"
              >
                <X size={20} />
              </Button>
            </CardHeader>
            <CardContent className="p-0 max-h-[600px] overflow-y-auto">
              {selectedPlatforms.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  Keine Portale gefunden
                </div>
              ) : (
                <div className="divide-y-2">
                  {selectedPlatforms.map((platform, idx) => (
                    <div key={idx} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-sm">{platform.Name}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(platform.Name);
                          }}
                          className="flex-shrink-0 p-1 hover:bg-muted rounded-full transition-colors"
                        >
                          <Star
                            size={16}
                            className={
                              starred.includes(platform.Name)
                                ? "fill-black text-black"
                                : "text-muted-foreground"
                            }
                          />
                        </button>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {platform.Type}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {platform.Description}
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="rounded-none border-2 w-full text-xs"
                      >
                        <a
                          href={platform.Link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Portal besuchen
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 rounded-none">
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">
                Klicken Sie auf ein Land, um Transparenzportale anzuzeigen
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
