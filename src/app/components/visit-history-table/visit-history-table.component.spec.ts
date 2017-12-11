import { CdkTableModule } from '@angular/cdk/table';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule, MatPaginatorModule, MatTableModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';

import { testVisits } from '../../models/visit';
import { VisitDataSource, VisitHistoryTableComponent } from './visit-history-table.component';

describe('VisitHistoryTableComponent', () => {
  let component: VisitHistoryTableComponent;
  let fixture: ComponentFixture<VisitHistoryTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        VisitHistoryTableComponent
      ],
      imports: [
        CdkTableModule,
        MatListModule,
        MatPaginatorModule,
        MatTableModule,
        NoopAnimationsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitHistoryTableComponent);
    component = fixture.componentInstance;
    component.visits$ = Observable.of(testVisits);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should format times properly', () => {
    const formatted = component.formatTime(testVisits[0].startedAt, testVisits[0].timezone);
    expect(formatted).toEqual('5:45 am')
  });

  it('should format the durations properly', () => {
    const formatted = component.formatDuration(testVisits[1]);
    expect(formatted).toEqual('6 hours')
  });

  it('should render the visits for a specific page', () => {
    component.dataSource = new VisitDataSource(component.visits$, component.paginator);
    component.paginator.pageIndex = 1;
    component.paginator.pageSize = 2;
    const pageData = component.dataSource.getPageData();
    expect(pageData.length).toEqual(2);
  });
});
