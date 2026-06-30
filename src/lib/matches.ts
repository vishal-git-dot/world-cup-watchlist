// FIFA World Cup 2026 — full match schedule.
// Kickoff times are stored as ISO UTC strings; the UI converts to the user's local time.

export type Stage =
  | "Group Stage"
  | "Round of 32"
  | "Round of 16"
  | "Quarter-final"
  | "Semi-final"
  | "Third Place"
  | "Final";

export interface Match {
  id: string;
  stage: Stage;
  group?: string;
  teamA: string;
  teamB: string;
  flagA: string;
  flagB: string;
  kickoffUTC: string; // ISO
  venue: string;
  city: string;
  country: "USA" | "Mexico" | "Canada";
  scoreA?: number;
  scoreB?: number;
}

// Helper to keep the table compact.
const m = (
  id: string,
  stage: Stage,
  teamA: string,
  flagA: string,
  teamB: string,
  flagB: string,
  kickoffUTC: string,
  venue: string,
  city: string,
  country: Match["country"],
  group?: string,
): Match => ({ id, stage, teamA, flagA, teamB, flagB, kickoffUTC, venue, city, country, group });

const TBD = "TBD";
const FLAG_TBD = "🏳️";

export const MATCHES: Match[] = [
  // ───── Group Stage ─────
  // Thu Jun 11
  m("1", "Group Stage", "Mexico", "🇲🇽", "South Africa", "🇿🇦", "2026-06-11T19:00:00Z", "Mexico City Stadium", "Mexico City", "Mexico", "A"),
  m("2", "Group Stage", "South Korea", "🇰🇷", "Czechia", "🇨🇿", "2026-06-12T02:00:00Z", "Estadio Guadalajara", "Zapopan", "Mexico", "A"),
  // Fri Jun 12
  m("3", "Group Stage", "Canada", "🇨🇦", "Bosnia", "🇧🇦", "2026-06-12T19:00:00Z", "Toronto Stadium", "Toronto", "Canada", "B"),
  m("4", "Group Stage", "USA", "🇺🇸", "Paraguay", "🇵🇾", "2026-06-13T01:00:00Z", "Los Angeles Stadium", "Los Angeles", "USA", "D"),
  // Sat Jun 13
  m("5", "Group Stage", "Qatar", "🇶🇦", "Switzerland", "🇨🇭", "2026-06-13T19:00:00Z", "San Francisco Bay Area Stadium", "San Francisco", "USA", "B"),
  m("6", "Group Stage", "Brazil", "🇧🇷", "Morocco", "🇲🇦", "2026-06-13T22:00:00Z", "New York New Jersey Stadium", "New Jersey", "USA", "C"),
  m("7", "Group Stage", "Haiti", "🇭🇹", "Scotland", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "2026-06-14T01:00:00Z", "Boston Stadium", "Boston", "USA", "C"),
  m("8", "Group Stage", "Australia", "🇦🇺", "Türkiye", "🇹🇷", "2026-06-14T04:00:00Z", "BC Place", "Vancouver", "Canada", "D"),
  // Sun Jun 14
  m("9", "Group Stage", "Germany", "🇩🇪", "Curaçao", "🇨🇼", "2026-06-14T17:00:00Z", "Houston Stadium", "Houston", "USA", "E"),
  m("10", "Group Stage", "Netherlands", "🇳🇱", "Japan", "🇯🇵", "2026-06-14T20:00:00Z", "Dallas Stadium", "Dallas", "USA", "F"),
  m("11", "Group Stage", "Ivory Coast", "🇨🇮", "Ecuador", "🇪🇨", "2026-06-14T23:00:00Z", "Philadelphia Stadium", "Philadelphia", "USA", "E"),
  m("12", "Group Stage", "Sweden", "🇸🇪", "Tunisia", "🇹🇳", "2026-06-15T02:00:00Z", "Estadio Monterrey", "Guadalupe", "Mexico", "F"),
  // Mon Jun 15
  m("13", "Group Stage", "Spain", "🇪🇸", "Cape Verde", "🇨🇻", "2026-06-15T16:00:00Z", "Atlanta Stadium", "Atlanta", "USA", "G"),
  m("14", "Group Stage", "Belgium", "🇧🇪", "Egypt", "🇪🇬", "2026-06-15T19:00:00Z", "BC Place", "Vancouver", "Canada", "H"),
  m("15", "Group Stage", "Saudi Arabia", "🇸🇦", "Uruguay", "🇺🇾", "2026-06-15T22:00:00Z", "Miami Stadium", "Miami", "USA", "G"),
  m("16", "Group Stage", "Iran", "🇮🇷", "New Zealand", "🇳🇿", "2026-06-16T01:00:00Z", "Los Angeles Stadium", "Los Angeles", "USA", "H"),
  // Tue Jun 16
  m("17", "Group Stage", "France", "🇫🇷", "Senegal", "🇸🇳", "2026-06-16T19:00:00Z", "New York New Jersey Stadium", "New Jersey", "USA", "I"),
  m("18", "Group Stage", "Iraq", "🇮🇶", "Norway", "🇳🇴", "2026-06-16T22:00:00Z", "Boston Stadium", "Boston", "USA", "I"),
  m("19", "Group Stage", "Argentina", "🇦🇷", "Algeria", "🇩🇿", "2026-06-17T01:00:00Z", "Kansas City Stadium", "Kansas City", "USA", "J"),
  m("20", "Group Stage", "Austria", "🇦🇹", "Jordan", "🇯🇴", "2026-06-17T04:00:00Z", "San Francisco Bay Area Stadium", "San Francisco", "USA", "J"),
  // Wed Jun 17
  m("21", "Group Stage", "Portugal", "🇵🇹", "DR Congo", "🇨🇩", "2026-06-17T17:00:00Z", "Houston Stadium", "Houston", "USA", "K"),
  m("22", "Group Stage", "England", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Croatia", "🇭🇷", "2026-06-17T20:00:00Z", "Dallas Stadium", "Dallas", "USA", "L"),
  m("23", "Group Stage", "Ghana", "🇬🇭", "Panama", "🇵🇦", "2026-06-17T23:00:00Z", "Toronto Stadium", "Toronto", "Canada", "L"),
  m("24", "Group Stage", "Uzbekistan", "🇺🇿", "Colombia", "🇨🇴", "2026-06-18T02:00:00Z", "Mexico City Stadium", "Mexico City", "Mexico", "K"),
  // Thu Jun 18
  m("25", "Group Stage", "Czechia", "🇨🇿", "South Africa", "🇿🇦", "2026-06-18T16:00:00Z", "Atlanta Stadium", "Atlanta", "USA", "A"),
  m("26", "Group Stage", "Switzerland", "🇨🇭", "Bosnia", "🇧🇦", "2026-06-18T19:00:00Z", "Los Angeles Stadium", "Los Angeles", "USA", "B"),
  m("27", "Group Stage", "Canada", "🇨🇦", "Qatar", "🇶🇦", "2026-06-18T22:00:00Z", "BC Place", "Vancouver", "Canada", "B"),
  m("28", "Group Stage", "Mexico", "🇲🇽", "South Korea", "🇰🇷", "2026-06-19T01:00:00Z", "Estadio Guadalajara", "Zapopan", "Mexico", "A"),
  // Fri Jun 19
  m("29", "Group Stage", "USA", "🇺🇸", "Australia", "🇦🇺", "2026-06-19T19:00:00Z", "Seattle Stadium", "Seattle", "USA", "D"),
  m("30", "Group Stage", "Scotland", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Morocco", "🇲🇦", "2026-06-19T22:00:00Z", "Boston Stadium", "Boston", "USA", "C"),
  m("31", "Group Stage", "Brazil", "🇧🇷", "Haiti", "🇭🇹", "2026-06-20T00:30:00Z", "Philadelphia Stadium", "Philadelphia", "USA", "C"),
  m("32", "Group Stage", "Türkiye", "🇹🇷", "Paraguay", "🇵🇾", "2026-06-20T03:00:00Z", "San Francisco Bay Area Stadium", "San Francisco", "USA", "D"),
  // Sat Jun 20
  m("33", "Group Stage", "Netherlands", "🇳🇱", "Sweden", "🇸🇪", "2026-06-20T17:00:00Z", "Houston Stadium", "Houston", "USA", "F"),
  m("34", "Group Stage", "Germany", "🇩🇪", "Ivory Coast", "🇨🇮", "2026-06-20T20:00:00Z", "Toronto Stadium", "Toronto", "Canada", "E"),
  m("35", "Group Stage", "Ecuador", "🇪🇨", "Curaçao", "🇨🇼", "2026-06-21T03:00:00Z", "Kansas City Stadium", "Kansas City", "USA", "E"),
  m("36", "Group Stage", "Tunisia", "🇹🇳", "Japan", "🇯🇵", "2026-06-21T04:00:00Z", "Estadio Monterrey", "Guadalupe", "Mexico", "F"),
  // Sun Jun 21
  m("37", "Group Stage", "Spain", "🇪🇸", "Saudi Arabia", "🇸🇦", "2026-06-21T16:00:00Z", "Atlanta Stadium", "Atlanta", "USA", "G"),
  m("38", "Group Stage", "Belgium", "🇧🇪", "Iran", "🇮🇷", "2026-06-21T19:00:00Z", "Los Angeles Stadium", "Los Angeles", "USA", "H"),
  m("39", "Group Stage", "Uruguay", "🇺🇾", "Cape Verde", "🇨🇻", "2026-06-21T22:00:00Z", "Miami Stadium", "Miami", "USA", "G"),
  m("40", "Group Stage", "New Zealand", "🇳🇿", "Egypt", "🇪🇬", "2026-06-22T01:00:00Z", "BC Place", "Vancouver", "Canada", "H"),
  // Mon Jun 22
  m("41", "Group Stage", "Argentina", "🇦🇷", "Austria", "🇦🇹", "2026-06-22T17:00:00Z", "Dallas Stadium", "Dallas", "USA", "J"),
  m("42", "Group Stage", "France", "🇫🇷", "Iraq", "🇮🇶", "2026-06-22T21:00:00Z", "Philadelphia Stadium", "Philadelphia", "USA", "I"),
  m("43", "Group Stage", "Norway", "🇳🇴", "Senegal", "🇸🇳", "2026-06-23T00:00:00Z", "New York New Jersey Stadium", "New Jersey", "USA", "I"),
  m("44", "Group Stage", "Jordan", "🇯🇴", "Algeria", "🇩🇿", "2026-06-23T03:00:00Z", "San Francisco Bay Area Stadium", "San Francisco", "USA", "J"),
  // Tue Jun 23
  m("45", "Group Stage", "Portugal", "🇵🇹", "Uzbekistan", "🇺🇿", "2026-06-23T17:00:00Z", "Houston Stadium", "Houston", "USA", "K"),
  m("46", "Group Stage", "England", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Ghana", "🇬🇭", "2026-06-23T20:00:00Z", "Boston Stadium", "Boston", "USA", "L"),
  m("47", "Group Stage", "Panama", "🇵🇦", "Croatia", "🇭🇷", "2026-06-23T23:00:00Z", "Toronto Stadium", "Toronto", "Canada", "L"),
  m("48", "Group Stage", "Colombia", "🇨🇴", "DR Congo", "🇨🇩", "2026-06-24T02:00:00Z", "Estadio Guadalajara", "Zapopan", "Mexico", "K"),
  // Wed Jun 24
  m("49", "Group Stage", "Switzerland", "🇨🇭", "Canada", "🇨🇦", "2026-06-24T19:00:00Z", "BC Place", "Vancouver", "Canada", "B"),
  m("50", "Group Stage", "Bosnia", "🇧🇦", "Qatar", "🇶🇦", "2026-06-24T19:00:00Z", "Seattle Stadium", "Seattle", "USA", "B"),
  m("51", "Group Stage", "Scotland", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Brazil", "🇧🇷", "2026-06-24T22:00:00Z", "Miami Stadium", "Miami", "USA", "C"),
  m("52", "Group Stage", "Morocco", "🇲🇦", "Haiti", "🇭🇹", "2026-06-24T22:00:00Z", "Atlanta Stadium", "Atlanta", "USA", "C"),
  m("53", "Group Stage", "Czechia", "🇨🇿", "Mexico", "🇲🇽", "2026-06-25T01:00:00Z", "Mexico City Stadium", "Mexico City", "Mexico", "A"),
  m("54", "Group Stage", "South Africa", "🇿🇦", "South Korea", "🇰🇷", "2026-06-25T01:00:00Z", "Estadio Monterrey", "Guadalupe", "Mexico", "A"),
  // Thu Jun 25
  m("55", "Group Stage", "Ecuador", "🇪🇨", "Germany", "🇩🇪", "2026-06-25T20:00:00Z", "New York New Jersey Stadium", "New Jersey", "USA", "E"),
  m("56", "Group Stage", "Curaçao", "🇨🇼", "Ivory Coast", "🇨🇮", "2026-06-25T20:00:00Z", "Philadelphia Stadium", "Philadelphia", "USA", "E"),
  m("57", "Group Stage", "Japan", "🇯🇵", "Sweden", "🇸🇪", "2026-06-25T23:00:00Z", "Dallas Stadium", "Dallas", "USA", "F"),
  m("58", "Group Stage", "Tunisia", "🇹🇳", "Netherlands", "🇳🇱", "2026-06-25T23:00:00Z", "Kansas City Stadium", "Kansas City", "USA", "F"),
  m("59", "Group Stage", "Türkiye", "🇹🇷", "USA", "🇺🇸", "2026-06-26T02:00:00Z", "Los Angeles Stadium", "Los Angeles", "USA", "D"),
  m("60", "Group Stage", "Paraguay", "🇵🇾", "Australia", "🇦🇺", "2026-06-26T02:00:00Z", "San Francisco Bay Area Stadium", "San Francisco", "USA", "D"),
  // Fri Jun 26
  m("61", "Group Stage", "Norway", "🇳🇴", "France", "🇫🇷", "2026-06-26T19:00:00Z", "Boston Stadium", "Boston", "USA", "I"),
  m("62", "Group Stage", "Senegal", "🇸🇳", "Iraq", "🇮🇶", "2026-06-26T19:00:00Z", "Toronto Stadium", "Toronto", "Canada", "I"),
  m("63", "Group Stage", "Cape Verde", "🇨🇻", "Saudi Arabia", "🇸🇦", "2026-06-27T00:00:00Z", "Houston Stadium", "Houston", "USA", "G"),
  m("64", "Group Stage", "Uruguay", "🇺🇾", "Spain", "🇪🇸", "2026-06-27T00:00:00Z", "Estadio Guadalajara", "Zapopan", "Mexico", "G"),
  m("65", "Group Stage", "Egypt", "🇪🇬", "Iran", "🇮🇷", "2026-06-27T03:00:00Z", "Seattle Stadium", "Seattle", "USA", "H"),
  m("66", "Group Stage", "New Zealand", "🇳🇿", "Belgium", "🇧🇪", "2026-06-27T03:00:00Z", "BC Place", "Vancouver", "Canada", "H"),
  // Sat Jun 27
  m("67", "Group Stage", "Panama", "🇵🇦", "England", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "2026-06-27T21:00:00Z", "New York New Jersey Stadium", "New Jersey", "USA", "L"),
  m("68", "Group Stage", "Croatia", "🇭🇷", "Ghana", "🇬🇭", "2026-06-27T21:00:00Z", "Philadelphia Stadium", "Philadelphia", "USA", "L"),
  m("69", "Group Stage", "Colombia", "🇨🇴", "Portugal", "🇵🇹", "2026-06-27T23:30:00Z", "Miami Stadium", "Miami", "USA", "K"),
  m("70", "Group Stage", "DR Congo", "🇨🇩", "Uzbekistan", "🇺🇿", "2026-06-27T23:30:00Z", "Atlanta Stadium", "Atlanta", "USA", "K"),
  m("71", "Group Stage", "Algeria", "🇩🇿", "Austria", "🇦🇹", "2026-06-28T02:00:00Z", "Kansas City Stadium", "Kansas City", "USA", "J"),
  m("72", "Group Stage", "Jordan", "🇯🇴", "Argentina", "🇦🇷", "2026-06-28T02:00:00Z", "Dallas Stadium", "Dallas", "USA", "J"),

  // ───── Round of 32 ─────
  m("73", "Round of 32", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-06-28T19:00:00Z", "Los Angeles Stadium", "Los Angeles", "USA"),
  m("74", "Round of 32", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-06-29T19:00:00Z", "Houston Stadium", "Houston", "USA"),
  m("75", "Round of 32", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-06-29T20:30:00Z", "Boston Stadium", "Boston", "USA"),
  m("76", "Round of 32", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-06-30T01:00:00Z", "Estadio Monterrey", "Guadalupe", "Mexico"),
  m("77", "Round of 32", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-06-30T17:00:00Z", "Dallas Stadium", "Dallas", "USA"),
  m("78", "Round of 32", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-06-30T21:00:00Z", "New York New Jersey Stadium", "New Jersey", "USA"),
  m("79", "Round of 32", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-01T01:00:00Z", "Mexico City Stadium", "Mexico City", "Mexico"),
  m("80", "Round of 32", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-01T16:00:00Z", "Atlanta Stadium", "Atlanta", "USA"),
  m("81", "Round of 32", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-01T20:00:00Z", "Seattle Stadium", "Seattle", "USA"),
  m("82", "Round of 32", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-02T00:00:00Z", "San Francisco Bay Area Stadium", "San Francisco", "USA"),
  m("83", "Round of 32", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-02T19:00:00Z", "Los Angeles Stadium", "Los Angeles", "USA"),
  m("84", "Round of 32", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-02T23:00:00Z", "Toronto Stadium", "Toronto", "Canada"),
  m("85", "Round of 32", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-03T03:00:00Z", "BC Place", "Vancouver", "Canada"),
  m("86", "Round of 32", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-03T18:00:00Z", "Dallas Stadium", "Dallas", "USA"),
  m("87", "Round of 32", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-03T22:00:00Z", "Miami Stadium", "Miami", "USA"),
  m("88", "Round of 32", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-04T01:30:00Z", "Kansas City Stadium", "Kansas City", "USA"),

  // ───── Round of 16 ─────
  m("89", "Round of 16", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-04T17:00:00Z", "Houston Stadium", "Houston", "USA"),
  m("90", "Round of 16", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-04T21:00:00Z", "Philadelphia Stadium", "Philadelphia", "USA"),
  m("91", "Round of 16", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-05T20:00:00Z", "New York New Jersey Stadium", "New Jersey", "USA"),
  m("92", "Round of 16", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-06T00:00:00Z", "Mexico City Stadium", "Mexico City", "Mexico"),
  m("93", "Round of 16", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-06T19:00:00Z", "Dallas Stadium", "Dallas", "USA"),
  m("94", "Round of 16", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-07T00:00:00Z", "Seattle Stadium", "Seattle", "USA"),
  m("95", "Round of 16", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-07T16:00:00Z", "Atlanta Stadium", "Atlanta", "USA"),
  m("96", "Round of 16", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-07T20:00:00Z", "BC Place", "Vancouver", "Canada"),

  // ───── Quarter-finals ─────
  m("97", "Quarter-final", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-09T20:00:00Z", "Boston Stadium", "Boston", "USA"),
  m("98", "Quarter-final", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-10T19:00:00Z", "Los Angeles Stadium", "Los Angeles", "USA"),
  m("99", "Quarter-final", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-11T20:00:00Z", "Miami Stadium", "Miami", "USA"),
  m("100", "Quarter-final", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-12T01:00:00Z", "Kansas City Stadium", "Kansas City", "USA"),

  // ───── Semi-finals ─────
  m("101", "Semi-final", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-14T19:00:00Z", "Dallas Stadium", "Dallas", "USA"),
  m("102", "Semi-final", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-15T19:00:00Z", "Atlanta Stadium", "Atlanta", "USA"),

  // ───── Third Place ─────
  m("103", "Third Place", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-18T21:00:00Z", "Miami Stadium", "Miami", "USA"),

  // ───── Final ─────
  m("104", "Final", TBD, FLAG_TBD, TBD, FLAG_TBD, "2026-07-19T19:00:00Z", "New York New Jersey Stadium", "New Jersey", "USA"),
];

export const STAGES: Stage[] = [
  "Group Stage",
  "Round of 32",
  "Round of 16",
  "Quarter-final",
  "Semi-final",
  "Third Place",
  "Final",
];
