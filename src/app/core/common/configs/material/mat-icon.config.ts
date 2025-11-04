import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';

export const MAT_ICON_OPTIONS = {
    provide: MAT_ICON_DEFAULT_OPTIONS,
    useValue: {
        fontSet: 'material-symbols-rounded',
    },
};
