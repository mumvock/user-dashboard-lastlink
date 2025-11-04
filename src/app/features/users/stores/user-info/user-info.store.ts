import { inject, Injectable } from '@angular/core';

import { AbstractStore } from '@sdk/common/abstracts';

import { User } from '~features/users/interfaces';
import { UsersRepository } from '~features/users/repositories/users/users.repository';

@Injectable({ providedIn: 'root' })
export class UserInfoStore extends AbstractStore<User | null> {
    private readonly _usersRepository = inject(UsersRepository);

    protected initialState(): User | null {
        return null;
    }

    public setUserInfo(user: User): void {
        this.setData(user);
    }

    public loadUserInfo(userId: number | string): void {
        this.connectData(
            this._usersRepository.getUserById$(String(userId))
        );
    }
}
