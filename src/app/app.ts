import { Component } from '@angular/core';

import APP_DEPENDENCIES from './app-dependencies';

@Component({
    selector: 'body[app-root]',
    templateUrl: './app.html',
    styleUrl: './app.scss',
    imports: APP_DEPENDENCIES.imports,
    providers: APP_DEPENDENCIES.providers
})
export class App {
}
