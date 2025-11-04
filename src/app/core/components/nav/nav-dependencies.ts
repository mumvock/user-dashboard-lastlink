import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import { ComponentDependencies } from '~shared/common/types';

const NAV_DEPENDENCIES: ComponentDependencies = {
    imports: [
        RouterLink,
        FormsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatButtonModule,
        MatButtonToggleModule
    ],
    providers: [
    ]
};
export default NAV_DEPENDENCIES;
