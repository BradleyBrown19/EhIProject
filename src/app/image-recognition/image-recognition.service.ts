import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class ImageRecognitionService {
    prediction: {'label': string, 'confidence': Number};
    private resultsUpdated = new Subject<{label: string, confidence: Number}>();

    constructor (private http: HttpClient, private router: Router) {}

    getResultsUpdateListener() {
        return this.resultsUpdated.asObservable();
    }

    analyzeImage(image: any, url: string) {
        this.http.post<{'success': any, 'predictions': {'label': string, 'confidence': Number}}>(url, image)
        .subscribe(result => {
            this.prediction = result.predictions;
            this.resultsUpdated.next({label: this.prediction.label, confidence: this.prediction.confidence});
        });
    }
}