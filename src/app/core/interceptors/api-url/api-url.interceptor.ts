import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '~env/environment.production';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {

    // Só adiciona a base URL se a requisição não começar com http:// ou https://
    if (!req.url.startsWith('http://') && !req.url.startsWith('https://')) {
        const apiUrl = environment.api.url;

        // Remove barras duplas se existirem
        const url = req.url.startsWith('/')
            ? `${apiUrl}${req.url}`
            : `${apiUrl}/${req.url}`;

        const apiReq = req.clone({ url });

        return next(apiReq);
    }

    return next(req);
};