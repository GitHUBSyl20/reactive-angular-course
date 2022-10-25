import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";

// one instance for the all application
@Injectable({ providedIn: "root" })
export class CoursesStore {
  private courseSubject$ = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.courseSubject$.asObservable();

  constructor(
    private httpClient: HttpClient,
    // need to define this service in the app.component so that the courses.store can also access it
    private loading: LoadingService,
    private message: MessagesService
  ) {
    this.loadAllCourses();
  }

  loadAllCourses() {
    const loadCourses$ = this.httpClient.get<Course[]>("/api/courses").pipe(
      map((res) => res["payload"]),
      catchError((err) => {
        const message = "error in gettin courses";
        this.message.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      // changes in visible in the front before and THEN
      tap((courses) => this.courseSubject$.next(courses))
    );

    // changes in the back afterward
    this.loading.showLoaderUntilCompleted(loadCourses$).subscribe();
  }

  saveCourse(courseId: string, changes: Partial<any>): Observable<any> {
    // to get the last value of the array since the subject keeos in memory the last used value --
    // list of courses last emitted byu the service
    const courses = this.courseSubject$.getValue();

    // index of the course we modify
    const index = courses.findIndex((course) => course.id == courseId);

    const newCourse: Course = {
      // copy of the newer version of the code
      ...courses[index],
      // we replace the initial object course indexed value with the new one changed version on the object
      ...changes,
    };

    // create copy of the current array. Different array pointing to the same object
    const newCourses: Course[] = courses.slice(0);

    newCourses[index] = newCourse;
    // only on the client side here
    this.courseSubject$.next(newCourses);

    return this.httpClient
      .put<Course>(`/api/courses/${courseId}`, changes)
      .pipe(
        catchError((err) => {
          const message = "there is a save error ";
          this.message.showErrors(message);
          console.log(message, err);
          // returning a new observable throwError replacing the previous one
          return throwError(err);
        }),
        shareReplay()
      );
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category == category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }
}
