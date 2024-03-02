import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {DataComponent} from "./data/data.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "data/:symbol",
    component: DataComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
