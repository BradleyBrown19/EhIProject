import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TextRecognitionService } from './mad-libs-service.component'
import { Subscription } from 'rxjs';
import { NgForm, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

const pythonApi = environment.pythonUrl;

@Component({
    selector: 'madlibs',
    templateUrl: './mad-libs.component.html',
    styleUrls: ['./mad-libs.component.scss']
})
export class MadLibs implements OnInit {
    storyModesRequired: any;
    resultingText: string;
    textRecognitionURL: string;
    private resultsSub: Subscription;
    input: string;
    output: string;
    titleOfStory: string;
    storyModes = [
        {value: 0, viewValue: 'Science Fiction'},
        {value: 1, viewValue: 'Religious Texts'},
        {value: 2, viewValue: 'Evening News'}
      ];

    storyModeURLs = [
        pythonApi + '/madlibs-scifi',
        pythonApi + '/madlibs-religious',
        pythonApi + '/madlibs-news'
    ]

    backgroundImageURLs = [
        "url('../../../assets/backgrounds/scifi-background.jpg')",
        "url('../../../assets/backgrounds/religious-background.jpg')",
        "url('../../../assets/backgrounds/madlibs-news.png')"
    ]
    imageBackgroundURL: string = "url('../../../assets/backgrounds/scifi-background.jpg')";

    constructor (private http: HttpClient, private router: Router, public textRecognitionService: TextRecognitionService) {}

    ngOnInit() {
        this.resultsSub = this.textRecognitionService.getResultsUpdateListener()
            .subscribe((result) => {
                console.log(result);
                this.output = result;
            });

            let storyModes = [
                {value: 0, viewValue: 'Science Fiction'},
                {value: 1, viewValue: 'Religious Texts'},
                {value: 2, viewValue: 'Evening News'}
              ];
    };

    changeStoryMode(value) {
        this.textRecognitionURL = this.storyModeURLs[value];
        this.imageBackgroundURL = this.backgroundImageURLs[value];

        if (value == 1) {
            document.getElementById('story-writing').style.color = 'black';
            document.getElementById('story-title').style.color = 'black';
        } else {
            document.getElementById('story-writing').style.color = 'white';
            document.getElementById('story-title').style.color = 'white';
        }
    }

    getText(title: string, content: string) {
        this.titleOfStory = title;
        document.getElementById('story-background').style.backgroundImage = this.imageBackgroundURL;
        this.textRecognitionService.analyzeText(content, this.textRecognitionURL);
    }

    onSubmit(form: NgForm) {
        if (form.invalid || this.textRecognitionURL == "") {
            return;
        }

        this.getText(form.value.title, form.value.content);
        
        form.resetForm();
    }

}