import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { MAT_ICON_OPTIONS } from '~core/common/configs';
import { apiUrlInterceptor, httpErrorInterceptor } from '~core/interceptors';
import { ColorSchemeService, GlobalErrorHandler, LoaderService } from '~core/services';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([
                apiUrlInterceptor,
                httpErrorInterceptor
            ])
        ),
        provideAppInitializer(() => {
            // Garante que estes serviços sejam iniciados com a aplicação
            inject(LoaderService);
            inject(ColorSchemeService);
        }),
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        },
        MAT_ICON_OPTIONS
    ]
};
