import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersListTable } from './users-list-table';

describe('UsersListTable', () => {
    let component: UsersListTable;
    let fixture: ComponentFixture<UsersListTable>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UsersListTable]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UsersListTable);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
