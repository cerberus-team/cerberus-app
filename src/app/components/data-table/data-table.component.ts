import { DataSource } from '@angular/cdk/table';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ColumnOptions } from '../../models/column-options';

/**
 * Provides what data should be rendered in the table. Note that the data source can retrieve its data in
 * any way. It is not the data source's responsibility to manage the underlying data. Instead, it only needs to take the
 * data and send the table exactly what should be rendered.
 */
export class DataTableSource extends DataSource<any> implements OnDestroy {
  data: any[];
  subscription: Subscription;

  constructor(private data$: Observable<any[]>, private paginator: MatPaginator) {
    super();
    this.subscription = this.data$
      .subscribe(data => this.data = data);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   */
  connect(): Observable<any[]> {
    return Observable.merge(this.paginator.page, this.data$).map(() => {
      return this.getPageData();
    });
  }

  getPageData(): any[] {
    const data = this.data.slice();
    // Grab the page's slice of data based on the current page and items per page.
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  disconnect() {}
}

@Component({
  selector: 'app-visit-history-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() data$: Observable<any[]>;
  @Input() columnOptions: ColumnOptions[];
  displayedColumns: string[];
  initialPageSize: number;
  dataSource: DataTableSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    // Determine initial page size using inner height of window at component init
    const surroundingElementsPx = 281;
    const cellPx = 49;
    this.initialPageSize = Math.floor((window.innerHeight - surroundingElementsPx) / cellPx);
    this.dataSource = new DataTableSource(this.data$, this.paginator);
    this.displayedColumns = this.columnOptions.map(column => column.columnDef);
  }
}