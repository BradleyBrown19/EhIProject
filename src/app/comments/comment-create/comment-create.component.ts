import { Component, OnInit } from '@angular/core';
import { Comment } from '../comment.model';
import { NgForm } from '@angular/forms';
import { CommentService } from '../comments.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
    selector: 'app-comment-create',
    templateUrl: './comment-create.component.html',
    styleUrls: ['./comment-create.component.css']
})
export class CommentCreateComponent implements OnInit {
    private mode = 'create';
    private commentId: string;
    comment: Comment;

    constructor(public commentsService: CommentService, public route: ActivatedRoute) {}

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
            this.commentsService.addComment(form.value.title, form.value.content);
        } else {
            this.commentsService.updateComment(this.commentId, form.value.title, form.value.content);
        }

        
        form.resetForm();
    }
}