import { Component } from '@angular/core';
import { Comment } from '../comment.model';
import { NgForm } from '@angular/forms';
import { CommentService } from '../comments.service';

@Component({
    selector: 'app-comment-create',
    templateUrl: './comment-create.component.html',
    styleUrls: ['./comment-create.component.css']
})
export class CommentCreateComponent {

    constructor(public commentsService: CommentService) {}

    onAddPost(form: NgForm) {
        if (form.invalid) {
            return;
        }

        this.commentsService.addComment(form.value.title, form.value.content);
        form.resetForm();
    }
}