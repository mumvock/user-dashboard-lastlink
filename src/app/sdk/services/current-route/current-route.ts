import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CurrentRouteService {
    private readonly _router = inject(Router);

    private readonly _unsubscribe$ = new Subject<void>();

    private readonly _currentRoute$ = new BehaviorSubject<string>('');
    public readonly currentRoute$ = this._currentRoute$.asObservable();

    constructor() {
        this._trackCurrentRoute();
    }

    private _trackCurrentRoute(): void {
        // Desinscrição por segurança
        this._unsubscribe$.next();
        this._unsubscribe$.complete();

        this._router.events.pipe(
            takeUntil(this._unsubscribe$),
            filter((event): event is NavigationEnd =>
                event instanceof NavigationEnd
            )
        )
        .subscribe((navigationEvent) =>
            this._currentRoute$.next(navigationEvent.url ?? '')
        );
    }

    /**
     * Navega para a rota ativa no momento.
     *
     * Útil para recarregar a página ou resetar o estado do componente.
     */
    public navigateToCurrentRoute(): void {
        const currentUrl = this._router.url;

        this._router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => this._router.navigate([currentUrl]));
    }
}