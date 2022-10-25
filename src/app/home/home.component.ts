import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { interval, noop, Observable, of, pipe, throwError, timer } from "rxjs";
import {
  catchError,
  delay,
  delayWhen,
  filter,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { CoursesService } from "../services/courses.service";
import { CoursesStore } from "../course/courses.store"
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(
    // much more easy
    //private courseService: CoursesService,
   // private loadingService: LoadingService,
   // private messagesService: MessagesService,
    public coursesStore: CoursesStore,
  ) {}

  ngOnInit() {
    // every time the component is loaded
    this.reloadCourses();
  }

  reloadCourses() {
  // console.log("in reload courses API");

    // a dollar means it's an observable by convention
    // we can verify by looking at it with the mouse
/*     const courses$ = this.courseService.loadAllCourses()
    .pipe(
      map((courses) => courses.sort(sortCoursesBySeqNo)),
        // replacing the observable with a new one (throwError is an observable)
        // when there is a catch of error due to failed courseService API
        catchError((err) => {
          const message = "could not load courses";
          this.messagesService.showErrors(message);
          console.log(message, err);
          return throwError(err);
        })
      ) */


    // ADDING LOADING courses ABILITIES via loadingService
    // creates a new observable
    // not changing it's implementation or emitted content
    //const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);

    // 2 derived observables means 2 http request
    // because there is 2 subscriptions via the ASYNC PIPE
    // lazy way of loading data from the backend because need subscription
 /*    this.beginnerCourses$ = loadCourses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category == "BEGINNER")
      ),
     // tap((courses) => console.log("courses", courses))
    ); */

/*     this.advancedCourses$ = loadCourses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category == "ADVANCED")
      )
    ); */

  this.beginnerCourses$ = this.coursesStore.filterByCategory("BEGINNER")
  this.advancedCourses$ = this.coursesStore.filterByCategory("ADVANCED")

  }
}
