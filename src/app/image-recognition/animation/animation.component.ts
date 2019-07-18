import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../attractiveness/mime-type.validator';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ImageRecognitionService } from '../image-recognition.service';
import { elementStart } from '@angular/core/src/render3';
import { Subscription } from 'rxjs';

@Component({
    selector: 'animation',
    templateUrl: './animation.component.html',
    styleUrls: ['./animation.component.css']
})
export class Animation implements OnInit {
    form: FormGroup;
    imagePreview: string;
    prediction: {'label': string, 'confidence': Number};
    predictionLabel: string;
    predictionConfidence: Number;
    imageRecognitionURL: string = "http://127.0.0.1:5000/predict-animation";
    private resultsSub: Subscription;
    resultsPic: any;
    imageToShow: any;
    isImageLoading: boolean = true;
    isImageFailed: boolean = false;

    constructor (private http: HttpClient, private router: Router, public imageRecognitionService: ImageRecognitionService) {}
    ngOnInit() {
        this.form = new FormGroup({
            image: new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mimeType],
            }) 
        })

        this.resultsSub = this.imageRecognitionService.getGANResultsUpdateListener()
            .subscribe((output) => {
                console.log(output);
                this.resultsPic = output;
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

        const image = new FormData();
        image.append("image", this.form.value.image)

        this.isImageLoading = true;
        this.imageRecognitionService.getGANImage(image, this.imageRecognitionURL).subscribe(data => {
            this.processResultsImage(data);
            this.isImageLoading = false;
        }, error => {
            this.isImageLoading = false;
            this.isImageFailed = true;
            console.log(error);
      });
        
        this.form.reset();
    }

    processResultsImage(resultPic: Blob) {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            this.imageToShow = reader.result;
         }, false);
      
         if (resultPic) {
            reader.readAsDataURL(resultPic);
         }
    }
}