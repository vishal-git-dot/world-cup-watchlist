// Map team display names to ISO 3166-1 alpha-2 codes (lowercased) for flagcdn.com.
// Special non-ISO codes: "gb-eng", "gb-sct" served by flagcdn.

const MAP: Record<string, string> = {
  "Mexico": "mx",
  "South Africa": "za",
  "South Korea": "kr",
  "Czechia": "cz",
  "Canada": "ca",
  "Bosnia": "ba",
  "USA": "us",
  "Paraguay": "py",
  "Qatar": "qa",
  "Switzerland": "ch",
  "Brazil": "br",
  "Morocco": "ma",
  "Haiti": "ht",
  "Scotland": "gb-sct",
  "Australia": "au",
  "Türkiye": "tr",
  "Germany": "de",
  "Curaçao": "cw",
  "Netherlands": "nl",
  "Japan": "jp",
  "Ivory Coast": "ci",
  "Ecuador": "ec",
  "Sweden": "se",
  "Tunisia": "tn",
  "Spain": "es",
  "Cape Verde": "cv",
  "Belgium": "be",
  "Egypt": "eg",
  "Saudi Arabia": "sa",
  "Uruguay": "uy",
  "Iran": "ir",
  "New Zealand": "nz",
  "France": "fr",
  "Senegal": "sn",
  "Iraq": "iq",
  "Norway": "no",
  "Argentina": "ar",
  "Algeria": "dz",
  "Austria": "at",
  "Jordan": "jo",
  "Portugal": "pt",
  "DR Congo": "cd",
  "England": "gb-eng",
  "Croatia": "hr",
  "Ghana": "gh",
  "Panama": "pa",
  "Uzbekistan": "uz",
  "Colombia": "co",
};

export function flagUrl(team: string): string | null {
  const code = MAP[team];
  if (!code) return null;
  return `https://flagcdn.com/w160/${code}.png`;
}

export function flagSrcSet(team: string): string | null {
  const code = MAP[team];
  if (!code) return null;
  return `https://flagcdn.com/w80/${code}.png 1x, https://flagcdn.com/w160/${code}.png 2x`;
}
