import { inject, Injectable, RendererFactory2, signal } from '@angular/core';

import { DomService } from '@sdk/services';

import { COLOR_SCHEME_CONFIG_KEY, COLOR_SCHEMES_CONFIG, DEFAULT_COLOR_SCHEME_CONFIG } from '~core/common/configs/color-schemes.config';
import { ColorSchemeConfig } from '~core/common/interfaces/color-scheme-config.interface';

@Injectable({ providedIn: 'root' })
export class ColorSchemeService {
    private readonly _domService = inject(DomService);
    private readonly _rendererFactory = inject(RendererFactory2);

    private readonly _renderer = this._rendererFactory.createRenderer(null, null);

    private readonly _currentColorScheme$$ = signal<ColorSchemeConfig>(this._recoverStoredColorScheme());
    public readonly currentColorScheme$$ = this._currentColorScheme$$.asReadonly();

    constructor() {
        this._initialize();
    }

    private _initialize(): void {
        const recoveredColorScheme = this._recoverStoredColorScheme();

        this.setCurrentColorScheme(recoveredColorScheme);
    }

    private _recoverStoredColorScheme(): ColorSchemeConfig {
        const recoveredSchemeEmoji: string | null = localStorage.getItem(COLOR_SCHEME_CONFIG_KEY);

        if (recoveredSchemeEmoji == null) return DEFAULT_COLOR_SCHEME_CONFIG;

        return COLOR_SCHEMES_CONFIG.find((scheme) => scheme.emoji === recoveredSchemeEmoji) ?? DEFAULT_COLOR_SCHEME_CONFIG;
    }

    public setCurrentColorScheme(scheme: ColorSchemeConfig): void {
        localStorage.setItem(COLOR_SCHEME_CONFIG_KEY, scheme.emoji);

        this._renderer.setAttribute(
            this._domService.rootElement,
            COLOR_SCHEME_CONFIG_KEY,
            scheme.emoji
        );

        this._currentColorScheme$$.set(scheme);
    }
}
