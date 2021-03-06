import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { formatDate, formatDuration, formatTime } from '../../helpers';
import { ColumnOptions, Site, Visit } from '../../models';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.scss'],
})
export class DataDisplayComponent implements OnInit {
  @Input() visits$: Observable<Visit[]>;
  @Input() sites$: Observable<Site[]>;
  visitTableColumnOptions: ColumnOptions[] = [
    {
      columnDef: 'date',
      header: 'Date',
      cell: (row: Visit) => formatDate(row.startedAt, row.timezone),
    },
    {
      columnDef: 'startedAt',
      header: 'Start',
      cell: (row: Visit) => formatTime(row.startedAt, row.timezone),
    },
    {
      columnDef: 'endedAt',
      header: 'End',
      cell: (row: Visit) => formatTime(row.endedAt, row.timezone),
    },
    {
      columnDef: 'duration',
      header: 'Duration',
      cell: (row: Visit) => formatDuration(row.startedAt, row.endedAt, row.timezone),
    },
  ];
  loading: boolean = true;

  constructor() {}

  ngOnInit(): void {
    // Timeout prevents lag caused by chart resize during sidenav toggle on page transition
    setTimeout(
      () => {
        this.loading = false;
      },
      500,
    );
  }

  /**
   * Passed to data-table as the colorFunc to highlight active visits.
   * @param {Visit} visit
   * @returns {string}
   */
  getVisitRowColor(visit: Visit): string {
    return !visit.endedAt ? 'rgba(204, 255, 103, 0.27)' : '';
  }
}
