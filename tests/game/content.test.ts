import { readFileSync } from 'node:fs'; 
import { describe, expect, it } from 'vitest'; 
import { ERROR_CODES, JOB_IDS } from '../../src/game'; 
 
const read = (p: string): unknown => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8')); 
type Messages = { job: Record<string, string>; error: Record<string, string>; venue: Record<string, 
string> }; 
 
describe('content and messages stay in sync', () => { 
  const en = read('../../src/messages/en.json') as Messages; 
  const fr = read('../../src/messages/fr.json') as Messages; 
 
  it('en and fr have identical key sets', () => { 
    const keys = (o: unknown, prefix = ''): string[] => 
      Object.entries(o as Record<string, unknown>).flatMap(([k, v]) => 
        typeof v === 'object' && v !== null ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`], 
      ); 
    expect(keys(fr).sort()).toEqual(keys(en).sort()); 
  }); 
 
  it('every job has a label in both languages', () => { 
    for (const id of JOB_IDS) { 
      expect(en.job[id]).toBeTruthy(); 
      expect(fr.job[id]).toBeTruthy(); 
    } 
  }); 
 
  it('every error code has a message in both languages', () => { 
    for (const code of ERROR_CODES) { 
      expect(en.error[code]).toBeTruthy(); 
      expect(fr.error[code]).toBeTruthy(); 
    } 
  }); 
 
  it('every venue nameKey resolves in both languages', () => { 
    const venues = read('../../content/venues.yaounde.json') as { venues: { id: string; nameKey: 
string }[] }; 
    expect(venues.venues.length).toBe(8); 
    for (const v of venues.venues) { 
      const key = v.nameKey.replace('venue.', ''); 
      expect(en.venue[key], v.id).toBeTruthy(); 
      expect(fr.venue[key], v.id).toBeTruthy(); 
    } 
  }); 
}); 
