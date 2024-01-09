import { Routes } from '@angular/router';
import { DashBoardComponent } from '../../modules/dashboard/dashboard.component';
import { TodayComponent } from '../../modules/today/today.component';

export const routes: Routes = [
    { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashBoardComponent },
    { path: 'today', component: TodayComponent },

    { path: '**',   redirectTo: '/dashboard', pathMatch: 'full' },
];
