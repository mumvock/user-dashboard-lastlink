import { Component, inject, OnInit, Signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, filter, map, Subject, switchMap } from 'rxjs';

import { MIN_SEARCH_LENGTH } from '~core/common/configs';
import { UsersListSearch } from '~features/users/components/user-list-search/users-list-search';
import { User } from '~features/users/interfaces';
import { UsersStore } from '~features/users/stores';
import USERS_LIST_DEPENDENCIES from './users-list-dependencies';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.html',
    styleUrl: './users-list.scss',
    imports: USERS_LIST_DEPENDENCIES.imports,
    providers: USERS_LIST_DEPENDENCIES.providers
})
export class UsersList implements OnInit {
    private readonly _usersStore = inject(UsersStore);

    @ViewChild('usersListSearch')
    private set _searchComponent(searchComponent: UsersListSearch) {
        this._searchComponentLoaded$.next(searchComponent);
    }

    protected readonly usersState$$ = toSignal(this._usersStore.dataState$, { initialValue: 'initial' });

    public readonly _searchComponentLoaded$ = new Subject<UsersListSearch>();

    protected filteredUsers$$ = this._filteredUsersFactory$$();

    public ngOnInit(): void {
        this._usersStore.loadUsers();
    }

    protected refreshUsers(): void {
        this._usersStore.refresh();
    }

    private _filteredUsersFactory$$(): Signal<User[]> {
        const filterUsers = (users: User[], searchValue: string): User[] => {
            const treatedValue = searchValue.trim().toLowerCase();
            const canFilter = treatedValue.length >= MIN_SEARCH_LENGTH;

            if (!canFilter) return users;

            return users.filter(user =>
                user.name.toLowerCase().includes(treatedValue) ||
                user.email.toLowerCase().includes(treatedValue) ||
                user.company.name.toLowerCase().includes(treatedValue)
            );
        };

        const filteredUsers$ = this._searchComponentLoaded$.pipe(
            filter(Boolean),
            switchMap(searchComponent =>
                combineLatest([
                    searchComponent.searchedValue$,
                    this._usersStore.data$
                ]).pipe(
                    map(([searchedValue, users]) =>
                        filterUsers(users, searchedValue ?? '')
                    )
                )
            )
        );

        return toSignal(filteredUsers$, { initialValue: [] });
    }

}
