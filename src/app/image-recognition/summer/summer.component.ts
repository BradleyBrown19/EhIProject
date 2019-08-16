import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../attractiveness/mime-type.validator';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ImageRecognitionService } from '../image-recognition.service';
import { elementStart } from '@angular/core/src/render3';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

const pythonApi = environment.pythonUrl;

@Component({
    selector: 'summer',
    templateUrl: './summer.component.html',
    styleUrls: ['./summer.component.scss']
})
export class Summer implements OnInit {
    form: FormGroup;
    imagePreview: string;
    prediction: {'label': string, 'confidence': Number};
    predictionLabel: string;
    predictionConfidence: Number;
    imageRecognitionURL: string = pythonApi + "/predict-painter";
    private resultsSub: Subscription;
    inDeployment = false;
    isImageLoading = false;

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

        const dogImage = new FormData();
        console.log(this.form.value.image);
        dogImage.append("image", this.form.value.image)

        this.imageRecognitionService.analyzeImage(dogImage, this.imageRecognitionURL);
        
        this.form.reset();
    }
}