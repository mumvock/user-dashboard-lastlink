import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, distinctUntilChanged, map, Observable, of, startWith, Subject, switchMap, takeUntil } from 'rxjs';

import { DataState } from '@sdk/common/types';
import { AutoCacheCleaner, DataCache, UpdateDataState } from '@sdk/common/utilities';
import { CurrentRouteService } from '@sdk/services';

interface StorePolicy {
    cacheable: boolean;
    clearOnError: boolean;
    clearOnNavigate: {
        enabled: boolean;
        excludedRoutes: string[];
        debounceTime: number;
    };
};

export abstract class AbstractStore<T> {
    private readonly _currentRoute = inject(CurrentRouteService);
    private readonly _destroyRef = inject(DestroyRef);

    protected readonly _dataState$ = new BehaviorSubject<DataState>('initial');
    public readonly dataState$ = this._dataState$.asObservable();

    protected readonly _data$ = new BehaviorSubject<T>(this.initialState());
    public readonly data$ = this._data$.asObservable();

    protected cachePolicy: StorePolicy = {
        cacheable: true,
        clearOnError: false,
        clearOnNavigate: {
            enabled: true,
            excludedRoutes: [],
            debounceTime: 3000
        }
    };

    private _lastSource$?: Observable<T>;

    private readonly _refreshTrigger$ = new Subject<void>();
    private readonly _disconnectData$ = new Subject<void>();

    private _cache?: DataCache<T>;

    private _connected = false;
    private _disposed = false;

    constructor() {
        this._setupAutoClean();
    }

    private _setupAutoClean(): void {
        const { clearOnNavigate } = this.cachePolicy;

        if (!clearOnNavigate.enabled) return;

        new AutoCacheCleaner(this._currentRoute, this._destroyRef, () => this._clearOnNavigate(), this._dataState$, {
            excludedRoutes: this.cachePolicy.clearOnNavigate.excludedRoutes,
            debounceTime: this.cachePolicy.clearOnNavigate.debounceTime,
            clearOnError: this.cachePolicy.clearOnError
        });
    }

    private _clearOnNavigate(): void {
        const observersCount = this._data$.observers?.length ?? 0;
        const noSubscribers = observersCount === 0;
        const isErrorState = this._dataState$.value === 'error';

        // Não limpa se estiver em estado de erro, a menos que explicitamente configurado
        if (isErrorState && !this.cachePolicy.clearOnError) {
            console.log('[Store] Cache mantido: estado de erro detectado');

            return;
        }

        // Não limpa se ainda houver conexão ativa (mesmo sem subscribers diretos)
        if (this._connected && !noSubscribers) {
            console.log('[Store] Cache mantido: há subscribers ativos');

            return;
        }

        if (noSubscribers) {
            console.log('[Store] Cache limpo por falta de uso pós navegação');
            this.clear();
        }
    }

    protected abstract initialState(): T;

    /** Útil para dados já sincronizados. */
    protected setData(value: T): void {
        if (this._disposed) return;

        this._data$.next(value);
        this._dataState$.next('success');
    }

    protected connectData(source$: Observable<T>): void {
        if (this._disposed) return;
        if (this._connected) return;

        this._lastSource$ = source$;
        this._connected = true;

        const stream$ = this._refreshTrigger$.pipe(
            startWith(void 0),
            switchMap(() =>
                UpdateDataState(this._dataState$, source$).pipe(
                    // Garante que erros não quebrem o stream principal
                    catchError((error) => {
                        console.error('[Store] Erro capturado:', error);
                        this._dataState$.next('error');

                        // Se configurado para limpar em erro, retorna estado inicial
                        if (this.cachePolicy.clearOnError) {

                            return of(this.initialState());
                        }

                        // Caso contrário, mantém o último valor conhecido
                        return of(this._data$.value);
                    })
                )
            )
        );

        const streamResult$ = this.cachePolicy.cacheable
            ? (this._cache ??= new DataCache<T>(stream$)).cachedData$
            : stream$;

        this._disconnectData$.next();

        streamResult$
            .pipe(
                takeUntil(this._disconnectData$),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: (data) => this._data$.next(data),
                error: (error) => {
                    console.error('[Store] Erro na subscription:', error);
                    this._dataState$.next('error');

                    // Mantém a conexão ativa mesmo após erro
                    // permitindo que refresh() funcione
                }
            });
    }

    /** Limpa cache, os dados e seu estado. */
    protected clear(): void {
        this._cache?.clear();
        this._dataState$.next('initial');
        this._data$.next(this.initialState());
        this._connected = false;
    }

    /** Força nova busca dos dados */
    public refresh(): void {
        if (this._disposed) return;
        if (!this._connected || !this._lastSource$) return;

        this._refreshTrigger$.next();
    }

    /** Reconecta após erro sem perder o estado */
    public reconnect(): void {
        if (this._disposed) return;
        if (!this._lastSource$) return;

        // Permite reconexão mesmo se já estava conectado
        this._connected = false;
        this.connectData(this._lastSource$);
    }

    /** Libera recursos (encerra store). */
    public dispose(): void {
        if (this._disposed) return;
        this._disposed = true;

        this._cache?.dispose();
        this._disconnectData$.next();

        this._disconnectData$.complete();
        this._dataState$.complete();
        this._data$.complete();
        this._refreshTrigger$.complete();

        this._cache = undefined;
        this._lastSource$ = undefined;
        this._connected = false;
    }

    public select<K extends keyof T>(key: K): Observable<T[K]>;
    public select<R>(selector: (state: T) => R): Observable<R>;
    public select(arg: keyof T | ((state: T) => any)): Observable<any> {
        const selectorFn =
            typeof arg === 'function'
                ? arg
                : (state: T) => state[arg as keyof T];

        return this.data$.pipe(
            map(selectorFn),
            distinctUntilChanged()
        );
    }
}