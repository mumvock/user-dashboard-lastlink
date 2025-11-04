import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';

import { DataState } from '@sdk/common/types';
import { User } from '~features/users/interfaces';
import { UsersRepository } from '~features/users/repositories/users/users.repository';
import { UsersStore } from './users.store';

describe('UsersStore', () => {
    let store: UsersStore;
    let repository: jasmine.SpyObj<UsersRepository>;
    let mockUsers: User[];

    beforeEach(() => {
        mockUsers = [
            {
                id: 1,
                name: 'John Doe',
                username: 'johndoe',
                email: 'john@example.com',
                address: {
                    street: 'Test St',
                    suite: 'Apt 1',
                    city: 'Test City',
                    zipcode: '12345',
                    geo: { lat: '0', lng: '0' }
                },
                phone: '123-456-7890',
                website: 'example.com',
                company: {
                    name: 'Test Company',
                    catchPhrase: 'Test Catch Phrase',
                    bs: 'Test BS'
                }
            }
        ];

        repository = jasmine.createSpyObj('UsersRepository', ['getUsers$']);
        repository.getUsers$.and.returnValue(of(mockUsers));

        TestBed.configureTestingModule({
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient(),
                UsersStore,
                { provide: UsersRepository, useValue: repository }
            ]
        });
        store = TestBed.inject(UsersStore);
    });

    it('should be created', () => {
        expect(store).toBeTruthy();
    });

    it('should have an empty initial state', async () => {
        const state = await firstValueFrom(store.data$);
        expect(state).toEqual([]);
    });

    describe('loadUsers', () => {
        it('should update state with users from repository', async () => {
            store.loadUsers();

            const state = await firstValueFrom(store.data$);
            expect(state).toEqual(mockUsers);
            expect(repository.getUsers$).toHaveBeenCalled();
        });

        it('should handle empty users list', async () => {
            repository.getUsers$.and.returnValue(of([]));

            store.loadUsers();

            const state = await firstValueFrom(store.data$);
            expect(state).toEqual([]);
        });

        it('should maintain last state when error occurs', async () => {
            store.loadUsers();
            await firstValueFrom(store.data$);

            repository.getUsers$.and.returnValue(throwError(() => new Error('Network error')));
            store.loadUsers();

            const state = await firstValueFrom(store.data$);
            expect(state).toEqual(mockUsers);
        });

        it('should follow the correct data state flow when loading', (done) => {
            const states: DataState[] = [];

            store.dataState$.subscribe({
                next: (state) => {
                    states.push(state);

                    if (state === 'success') {
                        expect(states).toContain('loading');
                        expect(states[states.length - 1]).toBe('success');
                        done();
                    }
                }
            });

            store.loadUsers();
        });

        it('should update dataState to success after loading', async () => {
            store.loadUsers();
            await firstValueFrom(store.data$);

            const dataState = await firstValueFrom(store.dataState$);
            expect(dataState).toBe('success');
        });

        it('should update dataState to error on failure', async () => {
            repository.getUsers$.and.returnValue(throwError(() => new Error('Network error')));

            store.loadUsers();

            await new Promise(resolve => setTimeout(resolve, 0));

            const dataState = await firstValueFrom(store.dataState$);
            expect(dataState).toBe('error');
        });

        it('should update dataState to empty when no users are found', async () => {
            repository.getUsers$.and.returnValue(of([]));

            store.loadUsers();
            await firstValueFrom(store.data$);

            const dataState = await firstValueFrom(store.dataState$);
            expect(dataState).toBe('empty');
        });

        it('should update state when new users are loaded', async () => {
            const newMockUsers = [...mockUsers, {
                id: 2,
                name: 'Jane Doe',
                username: 'janedoe',
                email: 'jane@example.com',
                address: {
                    street: 'Test St 2',
                    suite: 'Apt 2',
                    city: 'Test City',
                    zipcode: '12345',
                    geo: { lat: '0', lng: '0' }
                },
                phone: '098-765-4321',
                website: 'example2.com',
                company: {
                    name: 'Test Company 2',
                    catchPhrase: 'Test Catch Phrase 2',
                    bs: 'Test BS 2'
                }
            }];

            repository.getUsers$.and.returnValue(of(newMockUsers));
            store.loadUsers();

            const state = await firstValueFrom(store.data$);

            expect(state).toEqual(newMockUsers);
            expect(state.length).toBe(2);
        });
    });
});
