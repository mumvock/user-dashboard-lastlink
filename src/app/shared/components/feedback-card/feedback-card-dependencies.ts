import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ComponentDependencies } from '~shared/common/types';

const FEEDBACK_CARD_DEPENDENCIES: ComponentDependencies = {
    imports: [
        MatCardModule,
        MatIconModule
    ],
    providers: []
};
export default FEEDBACK_CARD_DEPENDENCIES;
