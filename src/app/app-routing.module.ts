import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { WikistComponent } from './pages/wikist/wikist.component';
import { MainComponent } from './pages/main/main.component';
import { AfetistComponent } from './pages/afetist/afetist.component';
const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'main',
    component: MainComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'wikist',
    component: WikistComponent,
  },
  {
    path: 'main',
    component: MainComponent,
  },
  {
    path:"afetist",
    component:AfetistComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
