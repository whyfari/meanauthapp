import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService,
              private router:Router,
              private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }

  onLogoutClick(){
    console.log('FA logout button clicked');
      this.authService.logout(); // not an observable
      this.flashMessage.show('FA logged out', {
        cssClass: 'alert-success',
        timeout: 3000
      });
      this.router.navigate(['/login']);
      return false;
  }
}
