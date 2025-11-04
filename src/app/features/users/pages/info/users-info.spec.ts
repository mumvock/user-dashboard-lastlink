import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { UsersInfo } from './users-info';

describe('UsersInfo', () => {
    let component: UsersInfo;
    let fixture: ComponentFixture<UsersInfo>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UsersInfo],
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient(),
                provideRouter([])
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UsersInfo);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
