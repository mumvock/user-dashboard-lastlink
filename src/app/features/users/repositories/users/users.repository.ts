import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '~env/environment.production';
import { User } from '~features/users/interfaces';

@Injectable({ providedIn: 'root' })
export class UsersRepository {
    private readonly _httpClient = inject(HttpClient);

    public getUsers$(): Observable<User[]> {
        return this._httpClient.get<User[]>(environment.api.endpoints.users);
    }

    public getUserById$(id: string): Observable<User> {
        return this._httpClient.get<User>(`${environment.api.endpoints.users}/${id}`);
    }

    public createUser$(user: Partial<User>): Observable<User> {
        return this._httpClient.post<User>(environment.api.endpoints.users, user);
    }
}