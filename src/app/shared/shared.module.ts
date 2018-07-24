import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule, MatProgressSpinnerModule,
  MatSelectModule,
  MatTableModule,
  MatTabsModule, MatToolbar, MatToolbarModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { DailyHoursChartComponent } from './components/daily-hours-chart/daily-hours-chart.component';
import { DataCellComponent } from './components/data-cell/data-cell.component';
import { DataDisplayComponent } from './components/data-display/data-display.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { LoaderComponent } from './components/loader/loader.component';
import { OrganizationFormComponent } from './components/organization-form/organization-form.component';
import { PasswordDialogComponent } from './components/password-dialog/password-dialog.component';
import { ServicesAgreementDialogComponent } from './components/services-agreement-dialog/services-agreement-dialog.component';
import { ServicesAgreementComponent } from './components/services-agreement/services-agreement.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { FindOrganizationComponent } from './containers/find-organization/find-organization.component';
import { ErrorService } from './services/error.service';
import { SnackBarService } from './services/snack-bar.service';

@NgModule({
  declarations: [
    DailyHoursChartComponent,
    DataCellComponent,
    DataDisplayComponent,
    DataTableComponent,
    FindOrganizationComponent,
    LoaderComponent,
    OrganizationFormComponent,
    PasswordDialogComponent,
    ServicesAgreementComponent,
    ServicesAgreementDialogComponent,
    UserFormComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    CdkTableModule,
    ChartsModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    PasswordDialogComponent, ServicesAgreementDialogComponent,
  ],
  providers: [
    ErrorService,
    SnackBarService,
  ],
  exports: [
    DataDisplayComponent,
    DataTableComponent,
    FindOrganizationComponent,
    LoaderComponent,
    PasswordDialogComponent,
    ServicesAgreementComponent,
    ServicesAgreementDialogComponent,
    OrganizationFormComponent,
    UserFormComponent,
  ],
})
export class SharedModule {}
