import { Comment } from './comment.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Router } from '@angular/router'

@Injectable({providedIn: 'root'})
export class CommentService {
    private comments: Comment[] = [];
    private commentsUpdated = new Subject<Comment[]>();

    constructor (private http: HttpClient) {}

    getComments() {
        this.http.get<{message: string, comments: Comment[]}>(
            'http://localhost:3000/api/comments')
            .subscribe((commentData) => {
                this.comments = commentData.comments;
                this.commentsUpdated.next([...this.comments]);
            });
    }

    getComment(id: string) {
        return {...this.comments.find(c => c._id == id)};
    }

    getCommentsUpdateListener() {
        return this.commentsUpdated.asObservable();
    }

    addComment(title: string, content: string) {
        const comment: Comment = {title: title, content: content, _id: null};

        this.http.post<{message: string, commentId: string}>('http://localhost:3000/api/comments', comment)
            .subscribe((commentData) => {
                const commentId = commentData.commentId;
                console.log(commentId);
                comment._id = commentId;
                this.comments.push(comment);
                this.commentsUpdated.next([...this.comments]);
            });
    }

    updateComment(id: string, title: string, content: string) {
        const comment: Comment = {_id: id, title: title, content: content};
        this.http.put("http://localhost:3000/api/comments/" + id, comment) 
            .subscribe((response) => {
                this.getComments();
            });
        }

    deletePost(commentId: string) {
        this.http.delete("http://localhost:3000/api/comments/"+ commentId)
            .subscribe(() => {
                console.log('Deleted');
                const updatedComments = this.comments.filter(comment => 
                    comment._id !== commentId
                );
                this.comments = updatedComments;
                this.commentsUpdated.next([...this.comments]);
                console.log("Post deleted");
            });
    }
}