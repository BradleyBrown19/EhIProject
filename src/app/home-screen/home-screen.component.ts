import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'home-screen',
    templateUrl: './home-screen.component.html',
    styleUrls: ['./home-screen.component.css']
})
export class HomeScreenComponent {
    weeklyfeature: String = 'Dog Image Classifier'
    weeklyImage: String = '../../assets/images/dogPrint.png'
    routerLink: String = 'dog-breeds'
    games: any[] = ['/dog-breeds', '/fruit-types']

    constructor (private http: HttpClient, private router: Router) {}

    randomGame() {
        console.log('called');
        let randomIndex = Math.floor(Math.random() * this.games.length);
        this.router.navigate([this.games[randomIndex]]);
    }
}