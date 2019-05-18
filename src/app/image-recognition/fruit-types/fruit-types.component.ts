import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from './mime-type.validator';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ImageRecognitionService } from '../image-recognition.service';
import { elementStart } from '@angular/core/src/render3';
import { Subscription } from 'rxjs';

@Component({
    selector: 'fruit-types',
    templateUrl: './fruit-types.component.html',
    styleUrls: ['./fruit-types.component.css']
})
export class FruitTypes implements OnInit {
    form: FormGroup;
    imagePreview: string;
    prediction: {'label': string, 'confidence': Number};
    predictionLabel: string;
    predictionConfidence: Number;
    imageRecognitionURL: string = "http://127.0.0.1:5000/predict-fruit";
    private resultsSub: Subscription;

    constructor (private http: HttpClient, private router: Router, public imageRecognitionService: ImageRecognitionService) {}

    ngOnInit() {
        this.form = new FormGroup({
            image: new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mimeType],
            }) 
        })

        this.resultsSub = this.imageRecognitionService.getResultsUpdateListener()
            .subscribe((predictions: {label: string, confidence: Number}) => {
                this.predictionLabel = predictions.label;
                this.predictionConfidence = predictions.confidence;
            });
    };

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: file});
        this.form.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        }
        
        reader.readAsDataURL(file);
    }

    analyzeImage() {
        if (this.form.invalid) {
            return;
        }

        const fruitImage = new FormData();
        fruitImage.append("image", this.form.value.image)

        this.imageRecognitionService.analyzeImage(fruitImage, this.imageRecognitionURL);
        
        this.form.reset();
    }
}