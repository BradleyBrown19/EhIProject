import { Component, OnInit, OnDestroy } from '@angular/core';
import { Comment } from '../comment.model';
import { NgForm } from '@angular/forms';
import { CommentService } from '../comments.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';


@Component({
    selector: 'app-comment-display',
    templateUrl: './comment-display.component.html',
    styleUrls: ['./comment-display.component.css']
})
export class CommentDisplayComponent implements OnInit, OnDestroy {
   comments: Comment[] = [];
   private commentsSub: Subscription;
   totalComments = 10;
   commentsPerPage = 3;
   currentPage = 1;
   pageSizeOptions = [1, 2, 5, 10];

    constructor(public commentsService: CommentService) {}

    ngOnInit() {
        this.commentsService.getComments(this.commentsPerPage, this.currentPage);
        this.commentsSub = this.commentsService.getCommentsUpdateListener()
            .subscribe((commentData: {comments: Comment[], commCount: number}) => {
                this.comments = commentData.comments;
                this.totalComments = commentData.commCount;
            });
    }

    ngOnDestroy() {
        this.commentsSub.unsubscribe();
    }

    onDelete(commentId: string) {
        this.commentsService.deletePost(commentId).subscribe(() => {
            this.commentsService.getComments(this.commentsPerPage, this.currentPage);
        });
    }

    onChangedPage(pageData: PageEvent) {
        this.currentPage = pageData.pageIndex + 1;
        this.commentsPerPage = pageData.pageSize;
        this.commentsService.getComments(this.commentsPerPage, this.currentPage);
    }

}