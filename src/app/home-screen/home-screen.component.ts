import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'home-screen',
    templateUrl: './home-screen.component.html',
    styleUrls: ['./home-screen.component.scss']
})
export class HomeScreenComponent {
    weeklyfeature: String = 'PictionarAI'
    weeklyImage: String = '../../assets/images/paint2.png'
    routerLink: String = 'pictionarAI-intro'
    games: any[] = ["/madlibs-intro", "/painter-intro", "/rps-preview", "/pictionarAI-intro"]

    constructor (private http: HttpClient, private router: Router) {}

    randomGame() {
        let randomIndex = Math.floor(Math.random() * this.games.length);
        this.router.navigate([this.games[randomIndex]]);
    }
}