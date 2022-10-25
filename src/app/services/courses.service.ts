import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { filter, map, shareReplay } from "rxjs/operators";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";

@Injectable({
  providedIn: "root",
})

// this service only returns observable
// the data is not kept in the service => it's a stateless service (not in memory)
// the data is accessible anywhere in the application WHERE THERE IS a subscription to the observable
export class CoursesService {
  constructor(private http: HttpClient) {}

  loadAllCourses(): Observable<Course[]> {
    // we receive an http response without modification - an observable
    // cad: an object containing a payload property
    return this.http.get<Course[]>("api/courses").pipe(
      // derived observable from the preceeding one
      map((res) => res["payload"]),
      shareReplay()
    );
  }

  loadCourseById(courseId: number): Observable<Course> {
    return this.http.get<Course>(`api/courses/${courseId}`)
    .pipe(
      shareReplay()
    )
  }

  loadAllCourseLessons(courseId: number): Observable<Lesson[]>{
    return this.http.get<Lesson[]>("api/lessons", {
      params: {
        pageSize: "10000",
        courseId: courseId.toString(),
      }
    }).pipe(
      map(res => res["payload"]),
      shareReplay()
    )
  }

  searchLessons(searchedLesson: string): Observable<Lesson[]>{
    console.log("searched Lessons", searchedLesson);
    return this.http.get<Lesson[]>("api/lessons", {
      params: {
        filter: searchedLesson,
        pageSize: "100",
      }
    }).pipe(
      map((res) => res["payload"]),
      shareReplay()
    )
  }



  saveCourse(courseId: string, changes: Partial<Course> ): Observable<any>{
    return this.http.put(`api/courses/${courseId}`, changes)
    .pipe(
      shareReplay()
    )
  }


}
