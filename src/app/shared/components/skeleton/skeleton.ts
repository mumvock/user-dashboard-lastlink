import { Component, Input, input, signal } from '@angular/core';

import { BorderRadius } from '~shared/common/types';
import SKELETON_DEPENDENCIES from './skeleton-dependencies';

@Component({
    selector: 'app-skeleton',
    templateUrl: 'skeleton.html',
    styleUrls: ['skeleton.scss'],
    imports: SKELETON_DEPENDENCIES.imports,
    providers: SKELETON_DEPENDENCIES.providers
})
export class Skeleton {
    @Input()
    public set borderRadius(borderRadius: BorderRadius) {
        if (!borderRadius) return;

        this._borderRadius.set(`var(--mat-sys-corner-${borderRadius})`);
    }

    protected readonly _borderRadius = signal<string | null>(null);

    public readonly repeat = input<number>(1);
    public readonly height = input<string | null>(null);
    public readonly width = input<string | null>(null);
    public readonly size = input<string | null>(null);
    public readonly skeletonClass = input<string | null>(null);
}
