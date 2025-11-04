import { Component, inject, input, Input, signal } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { User } from '~features/users/interfaces';
import { UserInfoStore } from '~features/users/stores';
import USERS_LIST_TABLE_DEPENDENCIES from './users-list-table-dependencies';

@Component({
    selector: 'app-users-list-table',
    templateUrl: './users-list-table.html',
    imports: USERS_LIST_TABLE_DEPENDENCIES.imports,
    providers: USERS_LIST_TABLE_DEPENDENCIES.providers
})
export class UsersListTable {
    private readonly _router = inject(Router);
    private readonly _userInfoStore = inject(UserInfoStore);

    @Input({ required: true })
    public set users(users: User[]) {
        this.tableDataSource$$.update((tableDataSource) => {
            tableDataSource.data = users;

            return tableDataSource;
        });
    }
    public get users(): User[] {
        return this.tableDataSource$$().data;
    }

    public readonly searchedValue = input.required<string>();

    protected readonly displayedColumns: string[] = ['actions', 'name', 'email', 'companyName'];
    protected readonly tableDataSource$$ = signal(new MatTableDataSource<User>([]));

    protected goToUserInfo(user: User) {
        this._userInfoStore.setUserInfo(user);
        this._router.navigate(['/users/info/' + user.id]);
    }
}
