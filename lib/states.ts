// lib/states.ts

export const US_STATES: { abbr: string; name: string; quirks: string }[] = [
  { abbr: "AL", name: "Alabama", quirks: "SEC football religion, sweet tea, small-town Alabama politics" },
  { abbr: "AK", name: "Alaska", quirks: "extreme weather, wildlife encounters, remote towns, bush planes" },
  { abbr: "AZ", name: "Arizona", quirks: "desert heat, snowbirds, cactus-related incidents, HOA drama" },
  { abbr: "AR", name: "Arkansas", quirks: "Walmart hometown vibes, catfish, Ozarks eccentricity" },
  { abbr: "CA", name: "California", quirks: "tech bros, wildfires, LA celebrity nonsense, NorCal vs SoCal drama" },
  { abbr: "CO", name: "Colorado", quirks: "recreational cannabis, skiing, altitude sickness, Denver weirdness" },
  { abbr: "CT", name: "Connecticut", quirks: "old money, pizza rivalries, Greenwich hedge-fund chaos" },
  { abbr: "DE", name: "Delaware", quirks: "everyone's a corporation, beach-town politics, tax-free shopping drama" },
  { abbr: "FL", name: "Florida", quirks: "Florida Man, hurricanes, alligators, retirement community chaos, swamps" },
  { abbr: "GA", name: "Georgia", quirks: "Atlanta traffic, peach obsession, SEC chaos, south Georgia farming" },
  { abbr: "HI", name: "Hawaii", quirks: "tourism vs locals, volcanic activity, aloha spirit misuse, surfing" },
  { abbr: "ID", name: "Idaho", quirks: "potatoes, libertarians, Boise growth shock, wilderness mishaps" },
  { abbr: "IL", name: "Illinois", quirks: "Chicago politics, deep-dish pizza wars, downstate vs Chicago divide" },
  { abbr: "IN", name: "Indiana", quirks: "high school basketball, corn, Indianapolis 500, Hoosier pride" },
  { abbr: "IA", name: "Iowa", quirks: "caucuses, corn mazes, State Fair weirdness, Des Moines surprises" },
  { abbr: "KS", name: "Kansas", quirks: "tornadoes, flat-earth vibes, cattle ranching, Wizard of Oz fatigue" },
  { abbr: "KY", name: "Kentucky", quirks: "horse racing, bourbon, coal country, UK basketball obsession" },
  { abbr: "LA", name: "Louisiana", quirks: "Mardi Gras chaos, gumbo rivalries, bayou wildlife, voodoo rumors" },
  { abbr: "ME", name: "Maine", quirks: "lobster drama, summer people, L.L. Bean, lighthouses, moose" },
  { abbr: "MD", name: "Maryland", quirks: "Old Bay on everything, blue crabs, DC suburb chaos, jousting" },
  { abbr: "MA", name: "Massachusetts", quirks: "Dunkin obsession, pahking the cah, Harvard snobbery, Patriots" },
  { abbr: "MI", name: "Michigan", quirks: "Detroit comebacks, UP vs Lower Peninsula war, pasties, lakes" },
  { abbr: "MN", name: "Minnesota", quirks: "Minnesota Nice passive aggression, hotdish, lutefisk, frozen lakes" },
  { abbr: "MS", name: "Mississippi", quirks: "Delta blues, catfish, heat, magnolia pride, small-town politics" },
  { abbr: "MO", name: "Missouri", quirks: "toasted ravioli, Branson, gateway arch chaos, Show Me stubbornness" },
  { abbr: "MT", name: "Montana", quirks: "Big Sky solitude, grizzly encounters, ranching, Yellowstone spillover" },
  { abbr: "NE", name: "Nebraska", quirks: "Husker football religion, corn, Runzas, windmill incidents" },
  { abbr: "NV", name: "Nevada", quirks: "Vegas excess, Area 51 tourism, desert survival, Burning Man fallout" },
  { abbr: "NH", name: "New Hampshire", quirks: "Live Free or Die extremism, primary politics, leaf peepers" },
  { abbr: "NJ", name: "New Jersey", quirks: "turnpike culture, pork roll vs Taylor ham war, shore drama" },
  { abbr: "NM", name: "New Mexico", quirks: "green vs red chile war, alien tourism, adobe aesthetics, heat" },
  { abbr: "NY", name: "New York", quirks: "NYC chaos, upstate resentment, bagel wars, bodega culture" },
  { abbr: "NC", name: "North Carolina", quirks: "BBQ holy wars, Research Triangle growth shock, tobacco legacy" },
  { abbr: "ND", name: "North Dakota", quirks: "oil boom bust, extreme cold, small-town isolation, bison" },
  { abbr: "OH", name: "Ohio", quirks: "swing-state chaos, Skyline Chili, Cleveland sports heartbreak, cornfields" },
  { abbr: "OK", name: "Oklahoma", quirks: "tornado chasers, oil country, Sooner vs Cowboy rivalry, rodeos" },
  { abbr: "OR", name: "Oregon", quirks: "Portland weirdness, no self-serve gas, Bigfoot sightings, rain" },
  { abbr: "PA", name: "Pennsylvania", quirks: "Philly attitude, Pittsburgh bridges, Amish country, Punxsutawney" },
  { abbr: "RI", name: "Rhode Island", quirks: "tiniest state drama, coffee milk, terrible drivers, mob nostalgia" },
  { abbr: "SC", name: "South Carolina", quirks: "Myrtle Beach chaos, shag dance, palmetto pride, golf culture" },
  { abbr: "SD", name: "South Dakota", quirks: "Mount Rushmore complaints, Sturgis chaos, Wall Drug, prairie wind" },
  { abbr: "TN", name: "Tennessee", quirks: "Nashville bachelorette invasion, BBQ, country music arguments, Dolly" },
  { abbr: "TX", name: "Texas", quirks: "everything bigger, HEB loyalty, Austin weird, cowboy culture, BBQ" },
  { abbr: "UT", name: "Utah", quirks: "Mormon culture shock, skiing, Jell-O salad, polygamy rumors" },
  { abbr: "VT", name: "Vermont", quirks: "maple syrup wars, Ben & Jerry's drama, leaf peepers, Bernie" },
  { abbr: "VA", name: "Virginia", quirks: "NoVA vs RoVA divide, Civil War tourism, crab cakes, horse country" },
  { abbr: "WA", name: "Washington", quirks: "Seattle tech-bro rain, ferry drama, Bigfoot, Walla Walla onions" },
  { abbr: "WV", name: "West Virginia", quirks: "mountain culture, pepperoni rolls, country roads nostalgia" },
  { abbr: "WI", name: "Wisconsin", quirks: "cheese obsession, Packer religion, supper clubs, frozen tundra" },
  { abbr: "WY", name: "Wyoming", quirks: "cowboys, Yellowstone tourist chaos, fewest people, wind" },
];

export const STATE_MAP: Record<string, (typeof US_STATES)[0]> = Object.fromEntries(
  US_STATES.map((s) => [s.abbr, s])
);

// In-memory cache: stateKey -> { stories, generatedAt }
// In production you'd swap this for Redis/Vercel KV
const memoryCache: Record<string, { stories: Story[]; generatedAt: string }> = {};

export function getCacheKey(stateAbbr: string): string {
  const date = new Date().toISOString().split("T")[0];
  return `${stateAbbr}-${date}`;
}

export function getFromCache(key: string) {
  return memoryCache[key] ?? null;
}

export function setInCache(key: string, stories: Story[]) {
  memoryCache[key] = { stories, generatedAt: new Date().toISOString() };
}

export interface Story {
  id: number;
  headline: string;
  location: string;
  category: string;
  emoji: string;
  teaser: string;
  time: string;
}
