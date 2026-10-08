import { z } from 'zod'; 
import { CITIES, JOB_IDS, ORIGINS } from './constants'; 
 
const key = z.string().min(8).max(100); 
const tier = z.union([z.literal(0), z.literal(1), z.literal(2)]); 
 
export const actionSchema = z.discriminatedUnion('type', [ 
  z.object({ type: z.literal('take_job'), key, jobId: z.enum(JOB_IDS) }), 
  z.object({ type: z.literal('work'), key }), 
  z.object({ type: z.literal('buy_meal'), key }), 
  z.object({ type: z.literal('pay_arrears'), key, amountFcfa: z.number().int().positive() }), 
  z.object({ type: z.literal('move_housing'), key, tier }), 
]); 
 
export const createPlayerSchema = z.object({ 
  id: z.string().min(1), 
  name: z.string().trim().min(2).max(24), 
  origin: z.enum(ORIGINS), 
  city: z.enum(CITIES), 
}); 
