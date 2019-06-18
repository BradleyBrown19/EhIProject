import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class TextRecognitionService {
    private resultsUpdated = new Subject<any>();
    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    constructor (private http: HttpClient, private router: Router) {}

    getResultsUpdateListener() {
        return this.resultsUpdated.asObservable();
    }

    async analyzeText(text: any, url: string) {

        const headers = new HttpHeaders();
        headers.set('Content-Type', 'application/json; charset=utf-8');
        let finalString: string = "";

        while (true) {

            if (text.indexOf('*') < 0) {
                finalString += text;
                break;
            }

            let partialString = text.substr(0, text.indexOf('*'));

            if (!partialString.length) {
                finalString += text;
                break;
            }

            let no_words = text.substr(text.indexOf('*') + 1, text.length);
            
            no_words = parseInt(no_words, 10);
            text = text.substr(text.indexOf('*') + 1, text.length);
            text = text.substr(text.search(/\D/), text.length);

            let promise = new Promise((res, rej) => {
                this.http.post(url, {text: partialString, no_words: no_words}, {headers: headers})
                    .subscribe(result => {
                        res(result);
                });
            });

            let finalStringPart = await promise;
            finalString += finalStringPart;
        }

        this.resultsUpdated.next(finalString);
    }
}