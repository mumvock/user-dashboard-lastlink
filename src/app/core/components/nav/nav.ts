import { Component, inject } from '@angular/core';

import { COLOR_SCHEMES_CONFIG } from '~core/common/configs/color-schemes.config';
import { ColorSchemeService } from '~core/services';
import NAV_DEPENDENCIES from './nav-dependencies';

@Component({
    selector: 'nav[app-nav]',
    templateUrl: './nav.html',
    styleUrls: ['./nav.scss'],
    imports: NAV_DEPENDENCIES.imports,
    providers: NAV_DEPENDENCIES.providers
})
export class Nav {
    protected readonly colorSchemeService = inject(ColorSchemeService);

    protected readonly COLOR_SCHEMES = COLOR_SCHEMES_CONFIG;
}
