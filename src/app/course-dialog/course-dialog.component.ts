import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { catchError, map, tap } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { CoursesService } from "../services/courses.service";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Message } from "../model/message";
import { CoursesStore } from "../course/courses.store";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  // an other instanc of the loading service because course-dialogue is not a direct child of appComponent
  providers: [LoadingService, MessagesService],
})
export class CourseDialogComponent {
  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    // private coursesService: CoursesService,
    private coursesStore: CoursesStore,
    // private loadingService: LoadingService,
    // private messageService: MessagesService
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngAfterViewInit() {}

  // on saving to the database the component need to reload
  save() {
    const changes = this.form.value;

    // modifying the saveCourse Observable to trigger the loading service waiting
    // this observable is not yet subscribed, therefore there is no way the courses could be saved

    const saveCourse$ = this.coursesStore
      // l'operateur pipe transforme l'observable en une observable
      .saveCourse(this.course.id, changes).subscribe();

    // below we subscribe to the method by passing the subscribe method into another observable method.
    // this observable contains an other observable
    //this.loadingService
    //   .showLoaderUntilCompleted(saveCourse$)
    // distinguish betweenn the close after successfull call and
    // normal close button of the mat dialog

    // this subscription is used also for the saveCourse Observable
    //  .subscribe((val) => this.dialogRef.close(val));
    this.dialogRef.close(changes)

  }

  close() {
    this.dialogRef.close();
  }
}
