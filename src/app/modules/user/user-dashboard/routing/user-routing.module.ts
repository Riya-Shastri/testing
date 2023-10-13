import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserSettingsComponent } from "../components/user-settings/user-settings.component";
import { UserActivitiesComponent } from "../components/user-activities/user-activities.component";
import { UserFollowersComponent } from "../components/user-followers/user-followers.component";
import { UserGeneralComponent } from "../components/user-general/user-general.component";
import { UserContentComponent } from "../components/user-content/user-content.component";
import { UserPurchasesComponent } from "../components/user-purchases/user-purchases.component";

const routes: Routes = [
  { path: "content/:id", component: UserContentComponent },
  { path: "activities", component: UserActivitiesComponent },
  { path: "followers", component: UserFollowersComponent },
  { path: "general", component: UserGeneralComponent },
  { path: "content", component: UserSettingsComponent },
  { path: "purchases/:id", component: UserPurchasesComponent },
  { path: "settings/:id", component: UserSettingsComponent },
  { path: ":id/settings/general", component: UserActivitiesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
