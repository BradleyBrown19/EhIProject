import { Comment } from './comment.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';

@Injectable({providedIn: 'root'})
export class CommentService {
    private comments: Comment[] = [];
    private commentsUpdated = new Subject<Comment[]>();

    constructor (private http: HttpClient) {}

    getComments() {
        this.http.get<{message: string, comments: Comment[]}>('http://localhost:3000/api/comments')
            .subscribe((commentData) => {
                this.comments = commentData.comments;
                this.commentsUpdated.next([...this.comments]);
            });
    }

    getCommentsUpdateListener() {
        return this.commentsUpdated.asObservable();
    }

    addComment(title: string, content: string) {
        const comment: Comment = {title: title, content: content, id: null};

        this.comments.push(comment);

        this.commentsUpdated.next([...this.comments]);
    }
}