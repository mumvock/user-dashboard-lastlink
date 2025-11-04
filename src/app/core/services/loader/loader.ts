import { ApplicationRef, ComponentRef, EnvironmentInjector, EventEmitter, Injectable, RendererFactory2, createComponent, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationError, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { DomService } from '@sdk/services';

import { Loader } from '~core/components';

@Injectable({ providedIn: 'root' })
export class LoaderService {
    private readonly _applicationRef = inject(ApplicationRef);
    private readonly _environmentInjector = inject(EnvironmentInjector);
    private readonly _domService = inject(DomService);

    public static loading = 0;
    private static _loaderComponentRef:
        | ComponentRef<Loader>
        | undefined;

    private readonly _renderer  = inject(RendererFactory2).createRenderer(null, null);

    private readonly _loading$  = new BehaviorSubject<boolean>(false);
    public readonly loading$  = this._loading$.asObservable();

    private readonly _loaderRendered$ = new EventEmitter<void>();
    public readonly loaderRendered$ = this._loaderRendered$.asObservable();

    private lazyLoading = false;
    private _createLoaderTimeout?: ReturnType<typeof setTimeout>;
    private _destroyLoaderTimeout?: ReturnType<typeof setTimeout>;

    constructor() {
        this._manageLazyLoadingLoader();
    }

    private _manageLazyLoadingLoader(): void {
        inject(Router).events
            .pipe(takeUntilDestroyed())
            .subscribe({
                next: (event) => {

                    if (event instanceof RouteConfigLoadStart) {
                        this._lazyLoadStarted();
                    }

                    const lazyLoadingEnd = event instanceof RouteConfigLoadEnd;
                    const navigationError = event instanceof NavigationError; // Se ocorre erro em runtime, o RouteConfigLoadEnd não é acionado.

                    if (lazyLoadingEnd || navigationError) {
                        this._lazyLoadCompleted();
                    }
                },
                error: () => this._lazyLoadCompleted()
            });
    }

    private _lazyLoadStarted(): void {
        if (this.lazyLoading) return;

        this.loadStarted();
        this.lazyLoading = true;
    }

    private _lazyLoadCompleted(): void {
        if (!this.lazyLoading) return;

        this.loadCompleted();
        this.lazyLoading = false;
    }

    public loadStarted(): void {
        LoaderService.loading++;
        this._checkLoading();
    }

    public loadCompleted(): void {

        if (LoaderService.loading) {
            LoaderService.loading--;
        }

        this._checkLoading();
    }

    private _checkLoading(): void {
        // Cancela timers anteriores para evitar múltiplas execuções
        if (this._createLoaderTimeout) {
            clearTimeout(this._createLoaderTimeout);
            this._createLoaderTimeout = undefined;
        }

        if (this._destroyLoaderTimeout) {
            clearTimeout(this._destroyLoaderTimeout);
            this._destroyLoaderTimeout = undefined;
        }

        if (LoaderService.loading) {
            this._loading$.next(true);
            this._createLoaderTimeout = setTimeout(() => {
                this._createLoaderComponent();
                this._createLoaderTimeout = undefined;
            }, 150);

        } else {
            this._loading$.next(false);
            this._destroyLoaderTimeout = setTimeout(() => {
                this._destroyLoaderComponent();
                this._destroyLoaderTimeout = undefined;
            }, 150);
        }
    }

    private _createLoaderComponent(): void {

        if (
            LoaderService._loaderComponentRef
            || !LoaderService.loading
        ) {
            return;
        }

        const loaderComponentRef = (LoaderService._loaderComponentRef =
            createComponent(Loader, {
                environmentInjector: this._environmentInjector,
            }));

        this._renderer.appendChild(
            this._domService.document?.body,
            loaderComponentRef.location.nativeElement
        );

        this._applicationRef.attachView(loaderComponentRef.hostView);
        this._loaderRendered$.emit();
    }

    private _destroyLoaderComponent(): void {

        if (
            !LoaderService._loaderComponentRef
            || LoaderService.loading
        ) {
            return;
        }

        // Armazena referência local para evitar problemas de concorrência
        const componentRef = LoaderService._loaderComponentRef;
        LoaderService._loaderComponentRef = undefined;

        if (componentRef) {
            this._applicationRef.detachView(componentRef.hostView);
            componentRef.destroy();
        }
    }
}
