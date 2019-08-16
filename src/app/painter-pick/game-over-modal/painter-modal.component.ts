import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'painter-end-game-modal',
  templateUrl: './painter-modal.component.html',
  styleUrls: ['./painter-modal.component.scss']
})
export class EndPainterModal implements OnInit {
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