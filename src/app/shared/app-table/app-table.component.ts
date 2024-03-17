import { Component, Input, OnInit, ContentChildren, QueryList, AfterContentInit, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppTableColumnComponent } from '../app-table-column/app-table-column.component';

@Component({
  selector: 'app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.css']
})
export class AppTableComponent implements OnInit, AfterContentInit, AfterViewInit {
  @Input() dataSource: any[] = [];
  @Input() pageSizeOptions: number[] = [10,15,20];

  columns: { name: string, width?: number, cellClass?: string }[] = [];
  tableDataSource = new MatTableDataSource<any>([]);

  @ContentChildren(AppTableColumnComponent) columnRefs!: QueryList<AppTableColumnComponent>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    if (this.columnRefs) {
      this.columns = this.columnRefs.map(columnRef => ({
        name: columnRef.name,
        width: columnRef.width,
        cellClass: columnRef.cellClass,
        headerText: columnRef.headerText
      }));

      // Set column widths
      this.columns.forEach(column => {
        if (column.width) {
          this.setColumnWidth(column.name, column.width);
        }
      });

      // Assign data to tableDataSource
      this.tableDataSource.data = this.dataSource;
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.tableDataSource.paginator = this.paginator;
    }
  }

  private setColumnWidth(columnName: string, width: number): void {
    const columnDivs = this.elementRef.nativeElement.querySelectorAll(`app-table-column[name="${columnName}"]`);
    if (columnDivs) {
      columnDivs.forEach((div: any) => {
        this.renderer.setStyle(div, 'width', `${width}px`);
      });
    }
  }

  getColumnNames(): string[] {
    return this.columns.map(column => column.name);
  }

  getColumnWidth(columnName: string): number {
    const column = this.columns.find(col => col.name === columnName);
    return column ? (column.width || 0) : 0;
  }

  getCellClasses(columnName: string): string {
    const column = this.columns.find(col => col.name === columnName);
    return column ? (column.cellClass || '') : '';
  }

  getColumnHeaderText(column: string): string {
    const columnRef = this.columnRefs.find(ref => ref.name === column);
    return columnRef ? (columnRef.headerText || columnRef.name) : column;
  }
}


