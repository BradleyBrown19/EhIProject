import { Comment } from './comment.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Router } from '@angular/router'

@Injectable({providedIn: 'root'})
export class CommentService {
    private comments: Comment[] = [];
    private commentsUpdated = new Subject<{comments: Comment[], commCount: number}>();

    constructor (private http: HttpClient, private router: Router) {}

    getComments(commentsPerPage: number, currentPage: number, topic: String) {
        console.log(topic)
        const queryParams = `?topic=${topic}&pageSize=${commentsPerPage}&page=${currentPage}`;
        this.http.get<{message: string, comments: Comment[], maxPosts: number}>(
            'http://localhost:3000/api/comments' + queryParams)
            .subscribe((commentData) => {
                this.comments = commentData.comments;
                this.commentsUpdated.next({comments: [...this.comments], commCount: commentData.maxPosts});
                this.router.navigate
            });
    }

    getComment(id: string) {
        return {...this.comments.find(c => c._id == id)};
    }

    getCommentsUpdateListener() {
        return this.commentsUpdated.asObservable();
    }

    addComment(title: string, content: string, topic: string) {
        const comment: Comment = {title: title, content: content, topic: topic, _id: null};

        this.http.post<{message: string, commentId: string}>('http://localhost:3000/api/comments', comment)
            .subscribe((commentData) => {
                this.router.navigate(["/comments"]);
            });
    }

    updateComment(id: string, title: string, content: string, topic: string) {
        const comment: Comment = {_id: id, title: title, content: content, topic: topic};
        this.http.put("http://localhost:3000/api/comments/" + id, comment) 
            .subscribe((response) => {
                this.router.navigate(["/comments"]);
            });
        }

    deletePost(commentId: string) {
        return this.http.delete("http://localhost:3000/api/comments/"+ commentId);
    }
}