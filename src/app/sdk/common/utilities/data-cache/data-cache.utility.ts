import { Observable, shareReplay, startWith, Subject, switchMap, takeUntil } from 'rxjs';

export class DataCache<T> {
    private readonly _refresh$ = new Subject<void>();
    private _clear$ = new Subject<void>();

    private _cachedData$!: Observable<Readonly<T>>;
    public get cachedData$(): Observable<Readonly<T>> {
        return this._cachedData$;
    }

    private _disposed = false;

    constructor(private _dataSource$: Observable<T>) {
        this._cachedData$ = this._createCache$(this._dataSource$);
    }

    private _createCache$(dataSource$: Observable<T>): Observable<Readonly<T>> {

        return this._refresh$.pipe(
            startWith(void 0),
            switchMap(() => dataSource$.pipe(takeUntil(this._clear$))),
            shareReplay({ bufferSize: 1, refCount: true })
        );
    }

    public updateSource(newSource$: Observable<T>): void {
        this._dataSource$ = newSource$;
        this.refresh();
    }

    public refresh(): void {
        this._refresh$.next();
    }

    public clear(): void {
        this._clear$.next();
        this._clear$.complete();

        this._clear$ = new Subject<void>();
        this._cachedData$ = this._createCache$(this._dataSource$);
    }

    public dispose(): void {
        if (this._disposed) return;
        this._disposed = true;

        this._clear$.next();
        this._clear$.complete();
        this._refresh$.complete();
    }
}