import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TickersListComponent } from './tickers-list.component';

const routes: Routes = [
  {
    path: '',
    component: TickersListComponent,
  },
  // {
  //   path: ':id',
  //   component: TickersListComponent
  // }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListRoutingModule {}
