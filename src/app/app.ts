import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'body[app-root]',
    imports: [RouterOutlet],
    template: '<router-outlet />'
})
export class App {
}
