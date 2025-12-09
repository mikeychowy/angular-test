import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { ButtonPaginatorComponent } from '../paginator/button-paginator.component';

@Component({
  selector: 'app-root',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    ButtonPaginatorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  private _httpClient = inject(HttpClient);
  displayedColumns: string[] = ['name', 'age', 'email', 'phone', 'address', 'balance', 'isActive'];
  dataSource: MatTableDataSource<Data>;

  data: Data[] = [];
  dataLength = signal(this.data.length);
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator | null;
  @ViewChild(MatSort) sort: MatSort | null;
  @ViewChild(ButtonPaginatorComponent) customPaginator: ButtonPaginatorComponent | null;

  constructor() {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.data);
    this.sort = null;
    this.paginator = null;
    this.customPaginator = null;
  }

  ngAfterViewInit() {
    getData(this._httpClient)
      .pipe(
        tap(() => (this.isLoadingResults = true)),
        startWith(this.data),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;

          if (data === null) {
            return [];
          }

          this.dataLength.set(data.length);
          return data;
        })
      )
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.customPaginator) {
      this.dataLength.set(this.dataSource._filterData.length);
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

export interface Data {
  _id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  address: string;
  balance: string;
  isActive: boolean;
}

function getData(_httpClient: HttpClient): Observable<Data[]> {
  return _httpClient.get<Data[]>(`/data.json`);
}
