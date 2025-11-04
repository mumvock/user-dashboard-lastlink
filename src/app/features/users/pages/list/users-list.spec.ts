import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';

import { FRONT_INPUT_DEBOUNCE_TIME } from '~core/common/configs';
import { UsersListSearch } from '~features/users/components/user-list-search/users-list-search';
import { User } from '~features/users/interfaces';
import { UsersStore } from '~features/users/stores';
import { UsersList } from './users-list';

describe('UsersList', () => {
    let component: UsersList;
    let fixture: ComponentFixture<UsersList>;
    let usersStoreMock: jasmine.SpyObj<UsersStore>;
    let searchComponent: UsersListSearch;
    let searchControl: FormControl;
    let searchFixture: ComponentFixture<UsersListSearch>;

    const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@test.com', company: { name: 'Company A' } },
        { id: 2, name: 'Jane Smith', email: 'jane@test.com', company: { name: 'Company B' } }
    ];

    beforeEach(async () => {
        usersStoreMock = jasmine.createSpyObj('UsersStore', ['loadUsers', 'refresh'], {
            dataState$: of('loaded'),
            data$: of(mockUsers)
        });

        await TestBed.configureTestingModule({
            imports: [UsersList, UsersListSearch],
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient(),
                { provide: UsersStore, useValue: usersStoreMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UsersList);
        component = fixture.componentInstance;

        searchFixture = TestBed.createComponent(UsersListSearch);
        searchComponent = searchFixture.componentInstance;
        searchControl = (searchComponent as any).searchControl;
        (component as any)._searchComponent = searchComponent;

        fixture.detectChanges();
        searchFixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load users on init', () => {
        component.ngOnInit();
        expect(usersStoreMock.loadUsers).toHaveBeenCalled();
    });

    it('should handle the refresh action', () => {
        (component as any).refreshUsers();
        expect(usersStoreMock.refresh).toHaveBeenCalled();
    });

    describe('User filtering', () => {
        it('should filter users by name', async () => {
            const searchValue = 'john';
            searchControl.setValue(searchValue);

            await new Promise((res) => setTimeout(res, FRONT_INPUT_DEBOUNCE_TIME));
            fixture.detectChanges();

            const filteredUsers = (component as any).filteredUsers$$() as User[];
            expect(filteredUsers.length).toBe(1);
            expect(filteredUsers[0].name.toLowerCase()).toContain(searchValue);
        });

        it('should filter users by email', async () => {
            const searchValue = 'jane@test';
            searchControl.setValue(searchValue);

            await new Promise((res) => setTimeout(res, FRONT_INPUT_DEBOUNCE_TIME));
            fixture.detectChanges();

            const filteredUsers = (component as any).filteredUsers$$() as User[];
            expect(filteredUsers.length).toBe(1);
            expect(filteredUsers[0].email.toLowerCase()).toContain(searchValue);
        });

        it('should filter users by company name', async () => {
            const searchValue = 'company a';
            searchControl.setValue(searchValue);

            await new Promise((res) => setTimeout(res, FRONT_INPUT_DEBOUNCE_TIME));
            fixture.detectChanges();

            const filteredUsers = (component as any).filteredUsers$$() as User[];
            expect(filteredUsers.length).toBe(1);
            expect(filteredUsers[0].company.name.toLowerCase()).toContain(searchValue);
        });

        it('should return all users when search value is less than minimum length', async () => {
            const searchValue = 'a';  // MIN_SEARCH_LENGTH > 1
            searchControl.setValue(searchValue);

            await new Promise((res) => setTimeout(res, FRONT_INPUT_DEBOUNCE_TIME));
            fixture.detectChanges();

            const filteredUsers = (component as any).filteredUsers$$() as User[];
            expect(filteredUsers.length).toBe(mockUsers.length);
        });

        it('should return empty array when no matches found', async () => {
            const searchValue = 'nonexistent';
            searchControl.setValue(searchValue);

            await new Promise((res) => setTimeout(res, FRONT_INPUT_DEBOUNCE_TIME));
            fixture.detectChanges();

            const filteredUsers = (component as any).filteredUsers$$() as User[];
            expect(filteredUsers.length).toBe(0);
        });

        it('should maintain state between searches', async () => {
            searchControl.setValue('john');
            await new Promise((res) => setTimeout(res, FRONT_INPUT_DEBOUNCE_TIME));
            fixture.detectChanges();
            const firstResults = (component as any).filteredUsers$$() as User[];
            expect(firstResults.length).toBe(1);
            expect(firstResults[0].name.toLowerCase()).toContain('john');

            searchControl.setValue('jane');
            await new Promise((res) => setTimeout(res, FRONT_INPUT_DEBOUNCE_TIME));
            fixture.detectChanges();

            const secondResults = (component as any).filteredUsers$$() as User[];
            expect(secondResults.length).toBe(1);
            expect(secondResults[0].name.toLowerCase()).toContain('jane');
        });
    });
});

