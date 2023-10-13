import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserRoutingModule } from "src/app/modules/user/user-dashboard/routing/user-routing.module";
import { UserSettingsComponent } from "./components/user-settings/user-settings.component";
import { UserGeneralComponent } from "./components/user-general/user-general.component";
import { UserActivitiesComponent } from "./components/user-activities/user-activities.component";
import { UserFollowersComponent } from "./components/user-followers/user-followers.component";
import { UserContentComponent } from "./components/user-content/user-content.component";
import { UserPurchasesComponent } from "./components/user-purchases/user-purchases.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  declarations: [
    UserSettingsComponent,
    UserGeneralComponent,
    UserActivitiesComponent,
    UserFollowersComponent,
    UserContentComponent,
    UserPurchasesComponent,
  ],
})
export class UserDashboardModule {}
