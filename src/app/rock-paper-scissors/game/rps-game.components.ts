import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { fromEvent, interval, Subscription } from 'rxjs';

@Component({
    selector: 'rps-game',
    templateUrl: './rps-game.component.html',
    styleUrls: ['./rps-game.component.css']
})
export class RPSGame implements AfterViewInit, OnInit {
    computerMove: String ='../../assets/images/rps/thumbs-up.png'
    moves: String[] = ['../../assets/images/rps/rock.png', '../../assets/images/rps/paper.png', '../../assets/images/rps/scissors.png']
    moveNames: String[] = ['rock', 'paper', 'scissor'];
    moveName: String;
    indexMove: any;
    rpsURL: string = "http://127.0.0.1:5000/predict-rock";
    prediction: string;
    winner: string = "Make a fist to start the game!"
    subscription: Subscription;
    rockPercentage: any;
    playerWins: any = 0;
    computerWins: any = 0;

    @ViewChild("video")
    public video: ElementRef;

    @ViewChild("canvas")
    public canvas: ElementRef;

    public captures: Array<any>;

    constructor (public ngxSmartModalService: NgxSmartModalService, private http: HttpClient, private router: Router) {}

    public ngOnInit() {
        this.startChecking();
    }

    public ngAfterViewInit() {
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                this.video.nativeElement.srcObject = stream;
                this.video.nativeElement.play();
            });
        }
    }

    startChecking() {
        const source = interval(1000);
        this.subscription = source.subscribe(val => this.checkForRock());
    }

    async checkForRock() {
        var context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 480);

        let sketchImage = new FormData();
        let canvas = this.canvas.nativeElement;

        let promise = new Promise((res, rej) => {
            canvas.toBlob(function(blob: Blob) {
            let file: File = new File([blob], 'sketch.png', {type: 'image/jpg'});
            sketchImage.append('image', file);
            res(file);
            }),
            'image/jpeg'
        })

        let file = await promise;

        this.http.post<{'success': any, 'predictions': {'label': string, 'confidence': Number}}>(this.rpsURL, sketchImage)
        .subscribe(result => {
            if (result.predictions.label == 'rock') {
                this.rockPercentage = result.predictions.confidence;
            }
            if (this.rockPercentage > 0.85) {
                this.startGame();
                this.subscription.unsubscribe();
            }
        }); 
    }

    public startGame() {
        this.winner = "Starting game..."

        setTimeout(() => {
            this.computerMove = '../../assets/images/rps/rock.png';
            this.winner = "Rock";

            setTimeout(() => {
                this.computerMove = '../../assets/images/rps/paper.png'
                this.winner = "paper";
    
                setTimeout(() => {
                    this.computerMove = '../../assets/images/rps/scissors.png'
                    this.winner = "scissors";
    
                    setTimeout(() => {
                        this.indexMove = Math.floor(Math.random() * 3);
                        this.moveName = this.moveNames[this.indexMove]; 
                        let move = this.moves[this.indexMove]
                        this.computerMove = move;
                        this.video.nativeElement.pause();
                        this.checkPlayerMove();
                    }, 1000);
    
                }, 1000);
    
            }, 1000);
        }, 1000);
    }

    async checkPlayerMove() {
        var context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 480);

        let sketchImage = new FormData();
        let canvas = this.canvas.nativeElement;

        let promise = new Promise((res, rej) => {
            canvas.toBlob(function(blob: Blob) {
            let file: File = new File([blob], 'sketch.png', {type: 'image/jpg'});
            sketchImage.append('image', file);
            res(file);
            }),
            'image/jpeg'
        })

        let file = await promise;
        
        this.http.post<{'success': any, 'predictions': {'label': string, 'confidence': Number}}>(this.rpsURL, sketchImage)
            .subscribe(result => {
                this.prediction = result.predictions.label;
                this.endGame();
        }); 
    }

    endGame() {
        let winner: string = this.checkWin();

        if (winner == 'player') {
            document.getElementById('video').style.border = "4px solid green";
            document.getElementById('move-background').style.border = "4px solid red";
            this.playerWins++;
            this.winner = "YOU WIN!";
        } else if (winner == 'computer') {
            document.getElementById('video').style.border = "4px solid red";
            document.getElementById('move-background').style.border = "4px solid green";
            this.winner = "YOU LOST :("
            this.computerWins++;
        } else {
            this.winner = "It's a draw"
        }

        setTimeout(() => {
            this.resetGame();
        }, 3000);
    }

    checkWin() {
        if (this.prediction == 'rock') {
            if (this.moveName == 'paper') {
                return 'computer';
            } else if (this.moveName == 'scissor') {
                return 'player';
            }
        } else if (this.prediction == 'paper') {
            if (this.moveName == 'scissor') {
                return 'computer';
            } else if (this.moveName == 'rock') {
                return 'player';
            }
        } else if (this.prediction == 'scissor') {
            if (this.moveName == 'rock') {
                return 'computer';
            } else if (this.moveName == 'paper') {
                return 'player';
            }
        }

        return 'draw';
    }

    resetGame() {

        this.moveName = "";
        this.prediction = "";
        this.winner = "Ready for a game";
        this.computerMove = '../../assets/images/rps/thumbs-up.png';
        this.video.nativeElement.play();
        document.getElementById('video').style.border = "2px solid black";
        document.getElementById('move-background').style.border = "2px solid black";
        this.startChecking();

    }

}
