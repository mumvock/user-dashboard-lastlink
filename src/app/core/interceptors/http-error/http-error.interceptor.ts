import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const snackBar = inject(MatSnackBar);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Ocorreu um erro inesperado';

            if (error.error instanceof ErrorEvent) {
                // Erro do lado do cliente
                errorMessage = `Erro: ${error.error.message}`;

            } else {
                // Erro do lado do servidor
                switch (error.status) {
                    case 400:
                        errorMessage = 'Requisição inválida';
                        break;

                    case 401:
                        errorMessage = 'Não autorizado';
                        router.navigate(['/login']);
                        break;

                    case 403:
                        errorMessage = 'Acesso negado';
                        break;

                    case 404:
                        errorMessage = 'Recurso não encontrado';
                        break;

                    case 500:
                        errorMessage = 'Erro interno do servidor';
                        break;

                    default:
                        errorMessage = `Erro ${error.status}: ${error.message}`;
                }
            }

            // Mostra notificação ao usuário
            snackBar.open(errorMessage, 'Fechar', {
                duration: 5000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });

            // Repassa o erro para quem chamou
            return throwError(() => error);
        })
    );
};