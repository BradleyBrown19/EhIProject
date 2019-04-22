import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'signup-page',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent {

    onSignup(form: NgForm) {
        console.log(form.value);
    }
}