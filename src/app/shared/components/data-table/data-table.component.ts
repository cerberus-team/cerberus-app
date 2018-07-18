import { DataSource } from '@angular/cdk/table';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material';
import { merge, Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { getIndex } from '../../../functions';
import { ColumnOptions } from '../../../models';

/**
 * Provides what data should be rendered in the table.
 * Note that the data source can retrieve its data in any way.
 * It is not the data source's responsibility to manage the underlying data.
 * Instead, it only needs to take the data and send the table
 * exactly what should be rendered.
 */
export class DataTableSource extends DataSource<any> implements OnDestroy {
  data: any[] = [];
  subscription: Subscription;

  constructor(private data$: Observable<any[]>, private paginator: MatPaginator) {
    super();
    if (this.data$) {
      this.subscription = this.data$.subscribe(data => this.data = data);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   */
  connect(): Observable<any[]> {
    return this.data$
      ? merge(this.paginator.page, this.data$)
        .pipe(
          map(() => {
            return this.getPageData();
          }),
        )
      : of([]);
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
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() data$: Observable<any[]>;
  @Input() columnOptions: ColumnOptions[];
  @Input() showDelete: boolean;
  @Input() isEditable: Boolean;
  @Input() getRowColor: (any) => string = () => '';
  @Output() updateItem = new EventEmitter<any>();
  @Output() updateMultipleItems = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();
  @Output() timeSelected = new EventEmitter<any>();
  displayedColumns: string[];
  itemsEdited: any[];
  invalidItemsEdited: any[];
  initialPageSize: number;
  dataSource: DataTableSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Initializes the data source on changes to data$.
   * @param {SimpleChanges} changes - the changes for data$
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data$']) {
      this.dataSource = new DataTableSource(changes['data$'].currentValue, this.paginator);
    }
  }

  /**
   * Sets the initial page size and columns to display.
   */
  ngOnInit(): void {
    this.itemsEdited = [];
    this.invalidItemsEdited = [];
    // Determine initial page size using inner height of window at component init
    const surroundingElementsPx = 224;
    const cellPx = 49;
    this.initialPageSize = Math.floor((window.innerHeight - surroundingElementsPx) / cellPx);
    this.displayedColumns = this.columnOptions.map(column => column.columnDef);
    if (this.showDelete) {
      this.displayedColumns.push('delete');
    }
  }

  getFontColor(column: any, row: any): string {
    if (!column.validator(row)) {
      return '#ff8984';
    }
  }

  getFontWeight(column: any, row: any): string {
    return column.validator && !column.validator(row) || this.itemsEdited.filter(item => item.id === row.id).length ? 'bold' : '';
  }

  /**
   * Getter for number of data items in the data source.
   * @returns {number} - the length of the data array in this.dataSource
   */
  get dataLength(): number {
    return !!(this.dataSource && this.dataSource.data) ? this.dataSource.data.length : null;
  }

  get pageSizeByWindowHeight(): number {
    const surroundingElementsPx = 217;
    const cellPx = 49;
    return Math.floor((window.innerHeight - surroundingElementsPx) / cellPx);
  }

  /**
   * Handles delete button click events by emitting a delete item event.
   * @param item - the item to be deleted
   */
  onClickDelete(item: any): void {
    this.deleteItem.emit(item);
  }

  /**
   * Handles the event the time is changed.
   *
   * @param value
   * @param item
   */
  onSelectTime(value, item, column): void {
    this.addItemToItemsEdited(column.timePicker.updateItemWithTime(value, item), column);
  }

  /**
   * Remove pre-existing item if exists and add item to itemsEdited if valid.
   *
   * @param item
   */
  addItemToItemsEdited(item: any, column: any): void {
    const itemsEditedIndex = getIndex(this.itemsEdited, item.id);
    const invalidItemsEditedIndex = getIndex(this.invalidItemsEdited, item.id);
    if (itemsEditedIndex !== undefined) {
      this.itemsEdited.splice(itemsEditedIndex, 1);
    }
    if (invalidItemsEditedIndex !== undefined) {
      this.invalidItemsEdited.splice(invalidItemsEditedIndex, 1);
    }
    if (column.validator(item)) {
      this.itemsEdited.push(item);
    } else {
      this.invalidItemsEdited.push(item);
    }
  }

  /**
   * Handles the event the user wants to update multiple items.
   *
   * @param items
   */
  onUpdateItems(items: any[]) {
    this.updateMultipleItems.emit(items);
    this.itemsEdited = [];
  }

  /**
   * Display update button if it is the last column option and isEditable is false.
   *
   * @param columnHeader
   * @param columnOptions
   * @param isEditable
   * @returns {boolean | boolean}
   */
  displayUpdateButton(column, columnOptions, isEditable) {
    return column === columnOptions[columnOptions.length - 1]
    && isEditable ? true : false;
  }

  /**
   * Handles select option events by emitting the item modified with the selected option.
   * @param value - the value to apply
   * @param item - the table item to modify
   * @param key - the property to modify
   */
  onSelectOption(value, item, key): void {
    const itemCopy = Object.assign({}, item);
    itemCopy[key] = value;
    this.updateItem.emit(itemCopy);
  }
}
