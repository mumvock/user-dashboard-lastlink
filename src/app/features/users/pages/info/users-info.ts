import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { UserInfoStore } from '~features/users/stores';
import USERS_DETAILS_DEPENDENCIES from './users-info-dependencies';

@Component({
    selector: 'app-users-info',
    templateUrl: './users-info.html',
    styleUrl: './users-info.scss',
    imports: USERS_DETAILS_DEPENDENCIES.imports,
    providers: USERS_DETAILS_DEPENDENCIES.providers
})
export class UsersInfo implements OnInit {
    private readonly _userInfoStore = inject(UserInfoStore);
    private readonly _activatedRoute = inject(ActivatedRoute);

    protected readonly userInfo$$ = toSignal(this._userInfoStore.data$, { initialValue: null });
    protected readonly userInfoState$$ = toSignal(this._userInfoStore.dataState$, { initialValue: 'initial' });

    public ngOnInit(): void {
        this._ensureUserInfo();
    }

    protected refreshUserInfo(): void {
        this._userInfoStore.refresh();
    }

    private _ensureUserInfo(): void {
        const noUserInfo = this.userInfo$$() == null; // Cenário onde a página foi completamente recarregada (F5)

        if (noUserInfo) {
            const id = this._activatedRoute.snapshot.paramMap.get('id')!;

            this._userInfoStore.loadUserInfo(id);
        }
    }
}
