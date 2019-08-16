import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'end-game-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class EndPictionaraiModal implements OnInit {
    ready: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  playAgain() {
    window.location.reload();
  }

  returnToMenu() {
    this.router.navigate(['/']);
  }

}