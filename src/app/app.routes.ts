import { Routes } from '@angular/router';
import { GraphComponent, PieComponent, ScatterComponent, ForceComponent } from './components';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: GraphComponent },
    { path: 'pie', component: PieComponent },
    { path: 'scatter', component: ScatterComponent },
    { path: 'force', component: ForceComponent },
];
