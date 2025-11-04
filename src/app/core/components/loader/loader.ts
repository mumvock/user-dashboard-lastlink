import { Component } from '@angular/core';

import LOADER_DEPENDENCIES from './loader-dependencies';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.html',
    styleUrls: ['./loader.scss'],
    imports: LOADER_DEPENDENCIES.imports,
    providers: LOADER_DEPENDENCIES.providers
})
export class Loader {}
