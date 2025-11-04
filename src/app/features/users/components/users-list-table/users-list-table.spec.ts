import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { UsersListTable } from './users-list-table';

describe('UsersListTable', () => {
    let component: UsersListTable;
    let fixture: ComponentFixture<UsersListTable>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UsersListTable],
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient(),
                provideRouter([])
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UsersListTable);
        component = fixture.componentInstance;

        // Configure required inputs
        component.users = [];
        fixture.componentRef.setInput('searchedValue', '');

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
