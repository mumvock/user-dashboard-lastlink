import { RouterOutlet } from '@angular/router';

import { Nav } from '~core/components';
import { ComponentDependencies } from '~shared/common/types';

const APP_DEPENDENCIES: ComponentDependencies = {
    imports: [
        RouterOutlet,
        Nav
    ],
    providers: [
    ]
};
export default APP_DEPENDENCIES;
