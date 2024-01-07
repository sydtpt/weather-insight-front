import { Routes } from '@angular/router';
import { DashBoardComponent } from './modules/dashboard/dashboard.component';
import { TodayComponent } from './modules/today/today.component';
import { AppComponent } from './app.component';
import { LayoutComponent } from './core/layout/layout.component';

export const routes: Routes = [
    { path: '',  component: AppComponent },
    { path: ':city',  component: LayoutComponent, 
        children: [
            { path: 'dashboard', component: DashBoardComponent },
            { path: 'today', component: TodayComponent },
            { path: '**',   redirectTo: 'today', pathMatch: 'full' }
        ], 
    },
    { path: '**',   redirectTo: '', pathMatch: 'full' },  // Wildcard route for a 404 page
];
