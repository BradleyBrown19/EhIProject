import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'login-page',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    onLogin(form: NgForm) {
        console.log(form.value);
    }
}