import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../auth/store/actions/auth.actions';
import * as LayoutActions from '../../../core/store/actions/layout.actions';
import { RootState } from '../../../core/store/reducers/index';
import { EmailDialogComponent } from '../../components/email-dialog/email-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  error: string;
  hidePwd: boolean;
  email: string;

  constructor(
    private formBuilder: FormBuilder,
    private store$: Store<RootState>,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    });
    this.hidePwd = true;
    this.store$.dispatch(new LayoutActions.SetSidenavOptions(null));
  }

  onLogin() {
    this.store$.dispatch(new AuthActions.SignIn({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }));
  }

  /**
   * Open the dialog and subscribe to the observable that is returned on close
   * to extract the email. Once email is obtained dispatch the reset password effect.
   */
  public onForgotPassword() {
    const dialog = this.dialog.open(EmailDialogComponent);
    dialog.afterClosed().subscribe((email) => {
      if (email) {
        this.store$.dispatch(new AuthActions.ResetPassword(email));
      }
    });
  }
}