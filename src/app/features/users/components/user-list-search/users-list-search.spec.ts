import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersListSearch } from './users-list-search';

describe('UsersListSearch', () => {
    let component: UsersListSearch;
    let fixture: ComponentFixture<UsersListSearch>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UsersListSearch]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UsersListSearch);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
