import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

// loading service might have multiple instances in the applicationnso it's not a singleton
@Injectable()
export class LoadingService {
  // at the loading of application the loader should not display
  // initially emits false
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor(){
    //console.log('loading service created')
  }

  // all the app (public Observable) can subscribe to loading$ but cannot change the value emitted
  // the change in value can only be done in the loading service via loadingOff and loadingOn functions
  // throught the behavior subject.
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  // on and off of the loading indicator is LINKED to the lifecycle of the observable
  // the observable takes an observable as input and transforms it
  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    // of allow to create a default observable in order to create an observable chain
    return of(null).pipe(
      // when receiving this inital value (null) we turn on the loading indicator
      tap(() => this.loadingOn()),
      // switch by emitting the value of the input observable (obs$) after the initial (null) value
      concatMap(() => obs$),
      // when complete OR ERROR OUT we finalise and stop the loading indicator
      finalize(() => this.loadingOff())
    );
  }

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}
