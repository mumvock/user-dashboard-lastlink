import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { UsersRepository } from '~features/users/repositories/users/users.repository';
import { UserInfoStore } from './user-info.store';

describe('UserInfoStore', () => {
    let service: UserInfoStore;
    let mockRepo: jasmine.SpyObj<UsersRepository>;

    beforeEach(() => {
        mockRepo = jasmine.createSpyObj<UsersRepository>('UsersRepository', ['getUserById$']);
        TestBed.configureTestingModule({
            providers: [
                provideZonelessChangeDetection(),
                UserInfoStore,
                { provide: UsersRepository, useValue: mockRepo },
            ],
        });
        service = TestBed.inject(UserInfoStore);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setUserInfo should call setData with the provided user', () => {
        const user = { id: '1', name: 'Alice' } as any;
        const setDataSpy = spyOn<any>(service, 'setData');
        service.setUserInfo(user);
        expect(setDataSpy).toHaveBeenCalledOnceWith(user);
    });

    it('loadUserInfo should call getUserById$ with stringified id and connectData with returned observable (number id)', () => {
        const user = { id: '2', name: 'Bob' } as any;
        const obs = of(user);
        mockRepo.getUserById$.and.returnValue(obs);
        const connectSpy = spyOn<any>(service, 'connectData');

        service.loadUserInfo(2);

        expect(mockRepo.getUserById$).toHaveBeenCalledWith('2');
        expect(connectSpy).toHaveBeenCalledWith(obs);
    });

    it('loadUserInfo should call getUserById$ with string id and connectData with returned observable (string id)', () => {
        const user = { id: 'xyz', name: 'Carol' } as any;
        const obs = of(user);
        mockRepo.getUserById$.and.returnValue(obs);
        const connectSpy = spyOn<any>(service, 'connectData');

        service.loadUserInfo('xyz');

        expect(mockRepo.getUserById$).toHaveBeenCalledWith('xyz');
        expect(connectSpy).toHaveBeenCalledWith(obs);
    });
});
