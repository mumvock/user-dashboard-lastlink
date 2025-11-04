import { WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';

import { DataState } from '@sdk/common/types';

function UpdateState(
    dataState$: BehaviorSubject<DataState> | WritableSignal<DataState>,
    newState: DataState
): void {

    if (dataState$ instanceof BehaviorSubject) {
        dataState$.next(newState);

        return;
    }

    dataState$.set(newState);
}

/**
 * Mantém atualizado o estado da recuperação de algum dado.
 *
 * @param dataState$ `Subject` (ou derivado) a ser atualizado.
 * @param data$ Origem do dado a ser recuperado.
 */
export function UpdateDataState<T>(
    dataState$: BehaviorSubject<DataState> | WritableSignal<DataState>,
    data$: Observable<T>
): Observable<T> {
    UpdateState(dataState$, 'loading');

    return data$.pipe(
        tap((data) => {
            const hasData = !!(Array.isArray(data) ? data.length : data);
            UpdateState(dataState$, hasData ? 'success' : 'empty');
        }),
        catchError((error) => {
            UpdateState(dataState$, 'error');

            throw error;
        }),
        take(1)
    );
}
