import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { json } from "body-parser";
import { BehaviorSubject, Observable } from "rxjs";
import { map, shareReplay, tap } from "rxjs/operators";
import { User } from "../model/user";


const AUTH_DATA = "auth_data"

@Injectable({
  providedIn: "root",
})
export class AuthStore {
  private subject = new BehaviorSubject<User>(null);

  // user$ observable emit the same values as subject
  user$: Observable<User> = this.subject.asObservable();

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));
    const user = localStorage.getItem(AUTH_DATA)
    // if user key value is present in local storage at start up time, then
    // pass itnto the appli cation
    if(user){
     this.subject.next(JSON.parse(user))
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>("/api/login", { email, password })
      .pipe(
        tap(user => {
          this.subject.next(user);
          localStorage.setItem(AUTH_DATA, JSON.stringify(user))
        }
        ),
        shareReplay(),
      );
  }

  logout() {
    console.log("lout out bnullify");
    this.subject.next(null);
    localStorage.removeItem(AUTH_DATA)
  }
}
