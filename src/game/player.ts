import { 
  MVP_CITIES, 
  RENT_INTERVAL_MS, 
  STARTING_ENERGY, 
  STARTING_FCFA, 
  STARTING_HOUSING_TIER, 
} from './constants'; 
import { createPlayerSchema } from './schemas'; 
import type { City, Origin, PlayerState } from './types'; 
 
export interface CreatePlayerInput { 
  id: string; 
  name: string; 
  origin: Origin; 
  city: City; 
} 
 
/** 
 * Pure factory for a brand-new player. Throws on invalid input. 
 * Only MVP cities are playable until the roadmap opens Douala and Buea. 
 */ 
export function createPlayer(input: CreatePlayerInput, now: number): PlayerState { 
  const parsed = createPlayerSchema.parse(input); 
  if (!(MVP_CITIES as readonly string[]).includes(parsed.city)) { 
    throw new Error(`City not open yet: ${parsed.city}`); 
  } 
  const housingTier = STARTING_HOUSING_TIER[parsed.origin]; 
  return { 
    id: parsed.id, 
    name: parsed.name, 
    origin: parsed.origin, 
    city: parsed.city, 
    fcfa: STARTING_FCFA[parsed.origin], 
    energy: STARTING_ENERGY, 
    jobId: null, 
    housingTier, 
    rentArrearsFcfa: 0, 
    nextRentDueAt: now + RENT_INTERVAL_MS, 
    lastAccruedAt: now, 
    seasonId: 0, 
    version: 0, 
  }; 
} 
