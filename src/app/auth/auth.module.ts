import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { SharedModule } from '../shared/shared.module';
import { LoginGuard } from './guards/login-guard';
import { VerificationGuard } from './guards/verification-guard';
import { AuthService } from './services/auth.service';
import { authEffects } from './store/effects';
import { authReducers } from './store/reducers';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('auth', authReducers),
    EffectsModule.forFeature(authEffects),
    AngularFireAuthModule,
    // Cerberus modules
    SharedModule,
  ],
  providers: [
    AuthService,
    LoginGuard,
    VerificationGuard,
  ],
})
export class AuthModule {
}
