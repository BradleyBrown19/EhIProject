import { Component, OnInit, OnDestroy } from '@angular/core';
import { Comment } from '../comment.model';
import { NgForm } from '@angular/forms';
import { CommentService } from '../comments.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-comment-display',
    templateUrl: './comment-display.component.html',
    styleUrls: ['./comment-display.component.css']
})
export class CommentDisplayComponent implements OnInit, OnDestroy {
    /*
    posts = [
        {title: "hi", content: "testing"}
    ];
    */
   comments: Comment[] = [];
   private commentsSub: Subscription;

    constructor(public commentsService: CommentService) {}

    ngOnInit() {
        this.commentsService.getComments();
        this.commentsSub = this.commentsService.getCommentsUpdateListener()
            .subscribe((comments: Comment[]) => {
                this.comments = comments;
            });
    }

    ngOnDestroy() {
        this.commentsSub.unsubscribe();
    }

    onDelete(commentId: string) {
        this.commentsService.deletePost(commentId);
    }

}