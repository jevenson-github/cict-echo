import { Injectable } from "@angular/core";
import { CanActivate, Router} from "@angular/router"

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate{
  constructor(private router:Router){}

  token:any;
  canActivate():any{

    //get the set token from the sign in page
    this.token = localStorage.getItem('token');
    if(this.token){
      return true;
    }
    else {
      //return the user to the sign in page
      this.router.navigate(['auth/']);
    }
  }
}