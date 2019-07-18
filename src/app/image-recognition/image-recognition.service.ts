import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ImageRecognitionService {
    prediction: {'label': string, 'confidence': Number};
    resultPic: any;
    private resultsUpdated = new Subject<{label: string, confidence: Number}>();
    private resultsGANUpdated = new Subject<{pic: any}>();

    constructor (private http: HttpClient, private router: Router) {}

    getResultsUpdateListener() {
        return this.resultsUpdated.asObservable();
    }

    getGANResultsUpdateListener() {
        console.log('in results updated listener');
        return this.resultsGANUpdated.asObservable();
    }

    analyzeImage(image: any, url: string) {
        this.http.post<{'success': any, 'predictions': {'label': string, 'confidence': Number}}>(url, image)
        .subscribe(result => {
            this.prediction = result.predictions;
            this.resultsUpdated.next({label: this.prediction.label, confidence: this.prediction.confidence});
        });
    }

    getGANImage(image: any, imageUrl: string): Observable<Blob> {
        return this.http.post(imageUrl, image, { responseType: 'blob' });
      }
    
}