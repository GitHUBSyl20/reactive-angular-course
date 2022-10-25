import { Component, OnInit } from "@angular/core";
import { Route, Router } from "@angular/router";
import { Observable } from "rxjs";
//import { LoadingService } from './loading/loading.service';
//import { MessagesService } from './messages/messages.service';
import { AuthStore } from "./services/auth.store";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  // ONE instance of the loading service only visible to the loading component and its child
  // course dialog is not a direct descendant of the app component therefore can not access the LoadingService
  // providers: [LoadingService, MessagesService]
  // for the store.ts to access theses serices they must be defined in the app.module (providers)
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(public auth: AuthStore, private router: Router) {}

  ngOnInit() {}

  logout() {
    console.log("log out");

    this.auth.logout();
    this.router.navigateByUrl('/login')
  }
}
