import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateUserComponent } from './user/create-user/create-user.component';
import { UserListComponent } from './user/user-list/user-list.component';

const routes: Routes = [
  {
    path: 'users',
    component: UserListComponent,
  },
  {
    path: 'users/create',
    component: CreateUserComponent,
  },
  // if no path found, redirect to user. Usually this would be 404
  { path: '**', redirectTo: '/users' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
