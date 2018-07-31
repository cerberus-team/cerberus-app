import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MaterialModule } from '../material';
import { SharedModule } from '../shared/shared.module';
import { TeamCardComponent } from './components/team-card/team-card.component';
import { TeamsPageComponent } from './containers/teams-page/teams-page.component';
import { TeamsEffects } from './effects/teams.effects';
import { reducers } from './reducers';
import { TeamsRoutingModule } from './teams-routing.module';
import { CreateTeamDialogComponent } from './containers/create-team-dialog/create-team-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    TeamsRoutingModule,

    /**
     * StoreModule.forFeature is used for composing state
     * from feature modules. These modules can be loaded
     * eagerly or lazily and will be dynamically added to
     * the existing state.
     */
    StoreModule.forFeature('teams', reducers),

    /**
     * Effects.forFeature is used to register effects
     * from feature modules. Effects can be loaded
     * eagerly or lazily and will be started immediately.
     *
     * All Effects will only be instantiated once regardless of
     * whether they are registered once or multiple times.
     */
    EffectsModule.forFeature([TeamsEffects]),
  ],
  declarations: [
    TeamCardComponent,
    TeamsPageComponent,
    CreateTeamDialogComponent,
  ],
  entryComponents: [
    CreateTeamDialogComponent,
  ],
})
export class TeamsModule {
}
