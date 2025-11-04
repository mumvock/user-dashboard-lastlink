import { NgClass, NgStyle } from '@angular/common';
import { RepeatDirective } from '@sdk/directives/repeat';

import { ComponentDependencies } from '~shared/common/types';

const SKELETON_DEPENDENCIES: ComponentDependencies = {
    imports: [
        NgStyle,
        NgClass,
        RepeatDirective
    ],
    providers: []
};
export default SKELETON_DEPENDENCIES;
