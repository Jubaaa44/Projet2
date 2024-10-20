import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { OfflineComponent } from './offline/offline.component';

const routes: Routes = [
  {
    path: '', // Dashboard
    component: HomeComponent,
  },
  {
    path: 'detail/:country', // Détail
    component: LineChartComponent,
  },
  { path: 'offline', // Page hors connexion
    component: OfflineComponent,
  },
  {
    path: '**', // wildcard
    component: NotFoundComponent,
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
