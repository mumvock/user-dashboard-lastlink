import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataState } from '@sdk/common/types';
import { CurrentRouteService } from '@sdk/services';
import { BehaviorSubject, debounceTime, filter, skip } from 'rxjs';

interface AutoCleanOptions {
    excludedRoutes?: string[];
    debounceTime?: number;
    clearOnError?: boolean;
}

export class AutoCacheCleaner {

    constructor(
        private _currentRouteService: CurrentRouteService,
        private _destroyRef: DestroyRef,
        private _clearFn: () => void,
        private _dataState$: BehaviorSubject<DataState>,
        private _options: AutoCleanOptions = {}
    ) {
        const { excludedRoutes = [], debounceTime: dTime = 3000, clearOnError = false } = this._options;

        this._currentRouteService.currentRoute$.pipe(
            skip(1),
            filter(route => !excludedRoutes.some((ex) => route.includes(ex))),
            debounceTime(dTime),
            takeUntilDestroyed(this._destroyRef)
        ).subscribe(() => {

            if (this._dataState$.value === 'error' && !clearOnError) {
                return;
            }

            this._clearFn();
        });
    }
}
