import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";


@Injectable()
export class MessagesService {
  private errorSubject = new BehaviorSubject<string[]>([])
  // initial value is an empty array we don't want to trigger the error Observable
  errors$: Observable<string[]> = this.errorSubject.asObservable()
  .pipe(
    // observable without the possibility of empty array to trigger the error
    filter(messages => messages && messages.length > 0)
  )

    showErrors(...errors: string[]){
       this.errorSubject.next(errors)
    }
}
