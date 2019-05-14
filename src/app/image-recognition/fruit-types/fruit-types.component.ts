import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from './mime-type.validator';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { elementStart } from '@angular/core/src/render3';

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

    constructor (private http: HttpClient, private router: Router) {}

    ngOnInit() {
        this.form = new FormGroup({
            image: new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mimeType],
            }) 
        })
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

        this.http.post<{'success': any, 'predictions': {'label': string, 'confidence': Number}}>("http://127.0.0.1:5000/predict", {image: fruitImage, type: 'fruit'})
            .subscribe(result => {
                this.prediction = result.predictions;
                this.predictionLabel = this.prediction.label;
                this.predictionConfidence = this.prediction.confidence;
            });
        
        this.form.reset();
    }
}