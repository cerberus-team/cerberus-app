import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { SignaturePadModule } from 'angular2-signaturepad';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import 'hammerjs';
import { ChartsModule } from 'ng2-charts';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
  AboutUsComponent,
  CheckInFormComponent,
  DailyHoursChartComponent,
  DataCellComponent,
  DataDisplayComponent,
  DataTableComponent,
  EmailDialogComponent,
  FooterComponent,
  HeaderComponent,
  NewVolunteerFormComponent,
  OrganizationConfirmComponent,
  OrganizationFormComponent,
  PasswordDialogComponent,
  ReportsFormComponent,
  SidenavComponent,
  SignatureFieldComponent,
  UserFormComponent,
  VolunteerMenuComponent,
} from './components';
import {
  CheckInComponent,
  GettingStartedComponent,
  JoinPageComponent,
  LoginComponent,
  OrganizationDashboardComponent,
  PublicOrganizationDashboardComponent,
  SettingsPageComponent,
} from './containers';
import {
  AuthEffects,
  CheckInEffects,
  GettingStartedEffects,
  LoginEffects,
  ModelEffects,
  RouterEffects,
  SettingsEffects,
} from './effects';
import { LoginGuard } from './login-guard';
import { reducers } from './reducers';
import {
  AuthService,
  CsvService,
  ErrorService,
  OrganizationService,
  SiteService,
  SnackBarService,
  UserService,
  VisitService,
  VolunteerService,
} from './services';
import { VerificationGuard } from './verification-guard';

@NgModule({
  declarations: [
    AboutUsComponent,
    AppComponent,
    CheckInComponent,
    CheckInFormComponent,
    DailyHoursChartComponent,
    DataDisplayComponent,
    DataTableComponent,
    FooterComponent,
    GettingStartedComponent,
    HeaderComponent,
    LoginComponent,
    NewVolunteerFormComponent,
    OrganizationFormComponent,
    OrganizationConfirmComponent,
    OrganizationDashboardComponent,
    PasswordDialogComponent,
    SettingsPageComponent,
    SignatureFieldComponent,
    UserFormComponent,
    VolunteerMenuComponent,
    SidenavComponent,
    ReportsFormComponent,
    JoinPageComponent,
    DataCellComponent,
    EmailDialogComponent,
    PublicOrganizationDashboardComponent,
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CdkTableModule,
    ChartsModule,
    EffectsModule.forRoot([
      AuthEffects,
      CheckInEffects,
      GettingStartedEffects,
      LoginEffects,
      ModelEffects,
      RouterEffects,
      SettingsEffects,
    ]),
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    ReactiveFormsModule,
    SignaturePadModule,
    StoreModule.forRoot(reducers),
    StoreRouterConnectingModule,
  ],
  providers: [
    AuthService,
    CsvService,
    ErrorService,
    LoginGuard,
    OrganizationService,
    SiteService,
    SnackBarService,
    UserService,
    VerificationGuard,
    VisitService,
    VolunteerService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [PasswordDialogComponent, EmailDialogComponent],
})
export class AppModule {
}
