import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';

import { FRONT_INPUT_DEBOUNCE_TIME } from '~core/common/configs';
import USERS_LIST_SEARCH_DEPENDENCIES from './users-list-search-dependencies';

@Component({
    selector: 'app-users-list-search',
    templateUrl: './users-list-search.html',
    styleUrl: './users-list-search.scss',
    imports: USERS_LIST_SEARCH_DEPENDENCIES.imports,
    providers: USERS_LIST_SEARCH_DEPENDENCIES.providers
})
export class UsersListSearch {
    private readonly _destroyRef = inject(DestroyRef);

    protected readonly searchControl = new FormControl();

    public readonly searchedValue$ = this.searchControl.valueChanges.pipe(
        debounceTime(FRONT_INPUT_DEBOUNCE_TIME),
        distinctUntilChanged(),
        startWith(null),
        takeUntilDestroyed(this._destroyRef)
    );
}
