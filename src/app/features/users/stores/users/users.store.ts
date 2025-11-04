import { inject, Injectable } from '@angular/core';

import { AbstractStore } from '@sdk/common/abstracts';

import { User } from '~features/users/interfaces';
import { UsersRepository } from '~features/users/repositories/users/users.repository';

@Injectable({ providedIn: 'root' })
export class UsersStore extends AbstractStore<User[]> {
    private readonly _usersRepository = inject(UsersRepository);

    protected initialState(): User[] {
        return [];
    }

    public loadUsers(): void {
        this.connectData(
            this._usersRepository.getUsers$()
        );
    }
}
