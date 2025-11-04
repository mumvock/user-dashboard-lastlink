import { Routes } from '@angular/router';

import { UsersInfo } from './pages/info/users-info';
import { UsersList } from './pages/list/users-list';

const USERS_ROUTES: Routes = [
    {
        path: '',
        component: UsersList,
        title: 'Users'
    },
    {
        path: 'info/:id',
        component: UsersInfo,
        title: 'User detail'
    },
];
export default USERS_ROUTES;
