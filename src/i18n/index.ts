import { de } from './de';
import { en } from './en';

export const LANGS = ['en', 'de'] as const;
export type Lang = (typeof LANGS)[number];

export const dict = { en, de } as const;

export const REPO_URL = 'https://github.com/smadev10/symtora';
