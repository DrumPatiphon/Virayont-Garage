
import { EventEmitter, Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root',
})
export class AuthService {
    currentUser: any;
    userChanged: EventEmitter<any> = new EventEmitter<any>();

    login(userData: any) {
      this.currentUser = userData;
      this.userChanged.emit(userData);
      console.log("userData :",this.currentUser);
    }
  
    getCurrentUser() {
      return this.currentUser;
    }
}

