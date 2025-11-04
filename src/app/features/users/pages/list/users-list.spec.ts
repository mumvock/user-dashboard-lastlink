import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersList } from './users-list';

describe('UsersList', () => {
    let component: UsersList;
    let fixture: ComponentFixture<UsersList>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UsersList],
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UsersList);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
