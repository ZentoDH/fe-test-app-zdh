import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { merge, of as observableOf, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, switchMap, map, catchError, takeUntil } from 'rxjs/operators';
import { Status } from 'src/app/_models/status.model';
import { User } from 'src/app/_models/user.model';
import { UserList } from 'src/app/_models/userList.model';
import { UserService } from '../user.service';

@Component({
  selector: 'exads-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['username', 'full_name', 'email', 'status', 'created_date'];
  pageSizeOptions: number[] = [5, 10, 20, 50, 75, 100];
  pageSize: number = 20;

  data: User[];
  statuses: Status[];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  private ngUnsubscribe = new Subject();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private userService: UserService,
  ) { }

  ngAfterViewInit(): void {
    // Filter and sort header can easily be added to the merge to add that functionality

    // If the user changes the sort order, reset back to the first page.
    merge(this.sort.sortChange).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe),
        startWith([]),
        switchMap(() => this.userService.getStatuses()),
        switchMap(statuses => {
          // I chose to always update the statuses with the users
          // This way, if a status is added and a user has this status, there won't be an error
          this.statuses = statuses.data
          this.isLoadingResults = true;

          return this.userService.getUsers(
            this.paginator.pageIndex,
            this.paginator.pageSize)
        }),
        map(response => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          // Api doesn't return total users, so hardcoded
          this.resultsLength = response.data.count;

          return response.data.users;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => { if (data.length) this.data = data });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  updatePageSize(size: number) {
    this.paginator._changePageSize(size);
    this.pageSize = size;
  }

  getStatusDescription(id) {
    return this.statuses.find(status => status.id === id).description
  }

}
