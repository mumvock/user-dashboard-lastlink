import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { ComponentDependencies } from '~shared/common/types';

const USERS_LIST_TABLE_DEPENDENCIES: ComponentDependencies = {
    imports: [
        RouterModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule
    ],
    providers: [
    ]
};
export default USERS_LIST_TABLE_DEPENDENCIES;
