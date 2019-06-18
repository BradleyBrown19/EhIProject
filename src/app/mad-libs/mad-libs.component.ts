import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TextRecognitionService } from './mad-libs-service.component'
import { Subscription } from 'rxjs';
import { NgForm, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'madlibs',
    templateUrl: './mad-libs.component.html',
    styleUrls: ['./mad-libs.component.css']
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
        {value: 2, viewValue: 'Political Statements'},
        {value: 3, viewValue: 'Evening News'}
      ];

    storyModeURLs = [
        'http://127.0.0.1:5000/madlibs-scifi',
        'http://127.0.0.1:5000/madlibs-religious',
        'http://127.0.0.1:5000/madlibs-politics',
        'http://127.0.0.1:5000/madlibs-news'
    ]

    backgroundImageURLs = [
        "url('../../../assets/backgrounds/scifi-background.jpg')",
        "url('../../../assets/backgrounds/religious-background.jpg')",
        "url('../../../assets/backgrounds/politics-background.jpg')",
        "url('../../../assets/backgrounds/news-background.jpg')"
    ]
    imageBackgroundURL: string = "url('../../../assets/backgrounds/scifi-background.jpg')";

    constructor (private http: HttpClient, private router: Router, public textRecognitionService: TextRecognitionService) {}

    ngOnInit() {
        this.resultsSub = this.textRecognitionService.getResultsUpdateListener()
            .subscribe((result) => {
                this.output = result;
            });
    };

    changeStoryMode(value) {
        this.textRecognitionURL = this.storyModeURLs[value];
        this.imageBackgroundURL = this.backgroundImageURLs[value];

        if (value == 1 || value == 2) {
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