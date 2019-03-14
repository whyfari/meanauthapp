import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService} from '../../services/auth.service';
import { FlashMessagesService} from 'angular2-flash-messages';
import { Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;

  constructor(private validateService: ValidateService,
              private flashMessages: FlashMessagesService, 
              private authService: AuthService, 
              private router: Router) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    console.log("FA register button clicked, name: " + this.name);
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password
    }
    // Required Fields
    if ( !this.validateService.validateRegister(user)) {
      this.flashMessages.show('FA Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }
    if ( !this.validateService.validateEmail(user.email)) {
      this.flashMessages.show('FA Invalid email', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Register user
    // since it's an observable we have to subscribe
    this.authService.registerUser(user).subscribe(data=> {
        if(data.success) {
            this.flashMessages.show('FA Registered', {cssClass: 'alert-success', timeout: 3000});
            this.router.navigate(['/login']);
        } else {
            this.flashMessages.show('FA Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
            this.router.navigate(['/register']);
        };
    });
  }

}
