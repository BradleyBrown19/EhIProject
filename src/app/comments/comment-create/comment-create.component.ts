import { Component, OnInit } from '@angular/core';
import { Comment } from '../comment.model';
import { NgForm } from '@angular/forms';
import { CommentService } from '../comments.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';

@Component({
    selector: 'app-comment-create',
    templateUrl: './comment-create.component.html',
    styleUrls: ['./comment-create.component.css']
})
export class CommentCreateComponent implements OnInit {
    private mode = 'create';
    private commentId: string;
    comment: Comment;
    topic: String;

    constructor(public commentsService: CommentService, public route: ActivatedRoute, private router: Router) {}

    topics = [
        {value: 'suggestions', viewValue: 'Suggestions'},
        {value: 'feedback', viewValue: 'Feedback'},
        {value: 'general', viewValue: 'General'},
      ];

    changeTopic(value) {
        this.topic = value
    }

    ngOnInit() {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('commentId')) {
                this.mode = 'edit';
                this.commentId = paramMap.get('commentId');
                this.comment =  this.commentsService.getComment(this.commentId);
            } else {
                this.mode = 'create';
                this.commentId = null;
            }
        });
    }

    onSavePost(form: NgForm) {
        if (form.invalid) {
            return;
        }

        if (this.mode === 'create') {
            this.commentsService.addComment(form.value.title, form.value.content, form.value.topic);
        } else {
            this.commentsService.updateComment(this.commentId, form.value.title, form.value.content, form.value.topic);
            this.router.navigateByUrl('/comment');
        }

        
        form.resetForm();
    }
}