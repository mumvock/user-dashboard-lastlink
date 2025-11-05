import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RepeatDirective } from '@sdk/directives/repeat';
import { UsersListSearch } from '~features/users/components/user-list-search/users-list-search';

import { UsersListTable } from '~features/users/components/users-list-table/users-list-table';
import { ComponentDependencies } from '~shared/common/types';
import { FeedbackCard, Skeleton } from '~shared/components';

const USERS_LIST_DEPENDENCIES: ComponentDependencies = {
    imports: [
        MatIconModule,
        MatButtonModule,
        UsersListSearch,
        UsersListTable,
        FeedbackCard,
        Skeleton,
        RepeatDirective
    ],
    providers: [
    ]
};
export default USERS_LIST_DEPENDENCIES;
