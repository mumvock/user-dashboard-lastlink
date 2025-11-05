
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { ComponentDependencies } from '~shared/common/types';
import { FeedbackCard, Skeleton } from '~shared/components';

const USERS_DETAILS_DEPENDENCIES: ComponentDependencies = {
    imports: [
        RouterModule,
        MatDividerModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        Skeleton,
        FeedbackCard
    ],
    providers: [
    ]
};
export default USERS_DETAILS_DEPENDENCIES;
