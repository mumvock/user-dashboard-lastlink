import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ComponentDependencies } from '~shared/common/types';

const USERS_LIST_SEARCH_DEPENDENCIES: ComponentDependencies = {
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    providers: [
    ]
};
export default USERS_LIST_SEARCH_DEPENDENCIES;
