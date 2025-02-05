import { atom } from "jotai";
import { SettingsType } from "../types";

export const settingsDataAtom = atom<SettingsType>({});

export const countAtom = atom(0);
