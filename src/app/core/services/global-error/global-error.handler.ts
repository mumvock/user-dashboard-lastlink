import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    public handleError(error: Error | HttpErrorResponse): void {

        if ((error instanceof HttpErrorResponse)) {
            console.error('[GlobalErrorHandler]: HTTP Error capturado:', error);

        } else {
            // Erros de runtime da aplicação
            console.error('[GlobalErrorHandler]: Erro da aplicação:', error);

            // - Envio para serviço de logging (Sentry, LogRocket, etc)
            // - Mostrar notificação ao usuário (dialog etc...)
            // - Redirecionar para página de erro
        }
    }
}