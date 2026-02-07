import { atom } from 'jotai';
import type { SettingsData } from '@/lib/fetchSettings';

/**
 * Settings data atom for global state management
 */
export const settingsDataAtom = atom<SettingsData | null>(null);

/**
 * Login state atom
 */
export const isLoginAtom = atom<boolean>(false);
