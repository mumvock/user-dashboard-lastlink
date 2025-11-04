import { ColorSchemeConfig } from './../interfaces/color-scheme-config.interface';

const BROWSER_SCHEME_CONFIG: ColorSchemeConfig = Object.freeze({
    emoji: '🌐',
    description: 'Applies the theme defined in your browser settings to the entire site.',
});

export const COLOR_SCHEMES_CONFIG: readonly ColorSchemeConfig[] = Object.freeze([
    BROWSER_SCHEME_CONFIG,
    {
        emoji: '🌑',
        description: 'Applies the dark theme to the entire site.',
    },
    {
        emoji: '☀️',
        description: 'Applies the light theme to the entire site.',
    }
]);
export const DEFAULT_COLOR_SCHEME_CONFIG = Object.freeze(BROWSER_SCHEME_CONFIG);
export const COLOR_SCHEME_CONFIG_KEY = 'color-scheme';
