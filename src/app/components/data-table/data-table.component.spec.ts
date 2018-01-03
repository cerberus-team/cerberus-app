import { CdkTableModule } from '@angular/cdk/table';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule, MatPaginatorModule, MatTableModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';

import { testColumnOptions } from '../../models/column-options';
import { testVisits } from '../../models/visit';
import { DataTableComponent, DataTableSource } from './data-table.component';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataTableComponent
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
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    component.columnOptions = testColumnOptions;
    component.data$ = Observable.of(testVisits);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should render data for a specific page', () => {
    component.dataSource = new DataTableSource(component.data$, component.paginator);
    component.paginator.pageIndex = 1;
    component.paginator.pageSize = 2;
    const pageData = component.dataSource.getPageData();
    expect(pageData.length).toEqual(2);
  });
});