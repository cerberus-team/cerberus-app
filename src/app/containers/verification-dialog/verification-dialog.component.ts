import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-verification-dialog',
  templateUrl: './verification-dialog.component.html',
  styleUrls: ['./verification-dialog.component.scss']
})
export class VerificationDialogComponent implements OnInit {

  pwd: string;
  hidePwd: boolean;

  constructor(public dialogRef: MatDialogRef<VerificationDialogComponent>) { }

  ngOnInit() {
    this.hidePwd = true;
  }

  /**
   * Close dialog and pass back data.
   */
  confirmSelection() {
    this.dialogRef.close(this.pwd);
  }
}