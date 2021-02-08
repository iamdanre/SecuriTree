import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { TreeComponent } from './tree/tree.component';
import { ManageDoorsComponent } from './manage-doors/manage-doors.component';

const routes: Routes = [
{ path: 'home', component: HomeComponent },
{ path: 'login', component: LoginComponent },
{ path: 'tree', component: TreeComponent },
{ path: 'doors', component: ManageDoorsComponent },
{ path: '', redirectTo: 'home', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
