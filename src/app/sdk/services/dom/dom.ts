import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

function _window(): Window {
    return window;
}

@Injectable({ providedIn: 'root' })
export class DomService {
    public readonly document = inject(DOCUMENT);

    private get _window() {

        return _window();
    }

    public get rootElement(): HTMLHtmlElement | null {

        return this.document.querySelector<HTMLHtmlElement>(':root');
    }

    public readonly window = this.document.defaultView ?? this._window;
}
