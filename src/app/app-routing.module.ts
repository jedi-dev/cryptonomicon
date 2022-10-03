import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'list',
    loadChildren: () =>
      import('./tickers-list/tickers-list.module').then(
        (m) => m.TickersListModule
      ),
  },
  // {
  //   path: '',
  //   redirectTo: 'list',
  //   pathMatch: 'full',
  // }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
