import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { State } from '../../../reducers/index';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.css']
})
export class DataDisplayComponent implements OnInit {
  visits$: Observable<State['visits']>;

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.visits$ = this.store.select('visits');
  }
}
