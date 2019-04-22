import { Component } from '@angular/core';
import { Comment } from './comments/comment.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  storedComments: Comment[] = [];

  title = 'AIGames';
}
