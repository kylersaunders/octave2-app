import { ERROR, IDLE, LOADING, SEEDS_IDLE_PHRASE, SEEDS_MAX_PHRASE, SUCCESS } from '@/lib/constants';
export type Status = typeof IDLE | typeof LOADING | typeof ERROR | typeof SUCCESS;
