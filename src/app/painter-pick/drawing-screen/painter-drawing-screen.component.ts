
import { Component, Input, ElementRef, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { fromEvent, interval, Subscription } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'
import { SimplifyAP, ISimplifyArrayPoint } from 'simplify-ts';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
var dataURLtoBlob = require('blueimp-canvas-to-blob');

import { environment } from 'src/environments/environment';

const pythonApi = environment.pythonUrl;


@Component({
    selector: 'painter-drawing-screen',
    templateUrl: './painter-drawing-screen.component.html',
    styleUrls: ['./painter-drawing-screen.component.scss']
})

export class PainterDrawingScreen implements AfterViewInit, OnInit {
    @ViewChild('canvas') public canvas: ElementRef;
    drawingArray: Array<[number, number]> = [];
    points: ISimplifyArrayPoint[] = [];
    imageRecognitionURL: string = pythonApi + "/predict-painter";
    file: File;
    prediction: {'label': Number[], 'confidence': Number};
    subscription: Subscription;
    currentPic: String;
    backgroundColor: string = 'white';
    strokeColor: string = 'black';
    //time: number;
    currentImg: string;
    guessedPainters: String[];
    classes: String[] = ['Leonardo_da_Vinci', 'Michelangelo', 'Mikhail_Vrubel', 'Pablo_Picasso', 'Paul_Cezanne', 'Paul_Gauguin', 'Pierre-Auguste_Renoir', 'Piet_Mondrian', 'Raphael', 'Rembrandt', 'Rene_Magritte', 'Salvador_Dali', 'Titian', 'Vincent_van_Gogh', 'Andrei_Rublev', 'Andy_Warhol', 'Caravaggio', 'Claude_Monet', 'Diego_Rivera', 'Diego_Velazquez', 'Edgar_Degas', 'Edvard_Munch', 'El_Greco', 'Frida_Kahlo', 'Georges_Seurat', 'Gustav_Klimt', 'Henri_Rousseau', 'Jackson_Pollock', 'Jan_van_Eyck', 'Joan_Miro']

    constructor (public ngxSmartModalService: NgxSmartModalService, private http: HttpClient, private router: Router) {}

    colors = [
      {value: 'black', viewValue: 'Black'},
      {value: 'white', viewValue: 'White'},
      {value: 'red', viewValue: 'Red'},
      {value: 'blue', viewValue: 'Blue'},
      {value: 'yellow', viewValue: 'Yellow'},
      {value: 'orange', viewValue: 'Orange'},
      {value: 'purple', viewValue: 'Purple'},
      {value: 'green', viewValue: 'Green'},
      {value: 'pink', viewValue: 'Pink'},
      {value: 'brown', viewValue: 'Brown'},
    ];

    ngOnInit() {
      const source = interval(1000);
      let randomInt = Math.floor(Math.random() * 30);
      this.currentPic = this.classes[randomInt];
      this.currentImg = '../../assets/painterImages/' + this.currentPic + '.png'

      this.subscription = source.subscribe(val => this.onSubmitCanvas());
      document.getElementById('background').style.backgroundColor = 'white';
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

    @Input() public width = 512;
    @Input() public height = 512;

    private cx: CanvasRenderingContext2D;  

    public ngAfterViewInit() {
        this.changeBackground()
    }

    public changeArtist() {
      let randomInt = Math.floor(Math.random() * 30);
      this.currentPic = this.classes[randomInt];
      this.currentImg = '../../assets/painterImages/' + this.currentPic + '.png'
      document.getElementById('background').style.backgroundColor = 'white';
      document.getElementById('message').innerHTML = 'Trying to paint like: ' + this.currentPic;
    }

    public changeBackground() {
      const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
      this.cx = canvasEl.getContext('2d');

      canvasEl.width = this.width;
      canvasEl.height = this.height;
      this.cx.fillStyle = this.backgroundColor;
      this.cx.fillRect(0, 0, canvasEl.width, canvasEl.height);

      // set some default properties about the line
      this.cx.lineWidth = 3;
      this.cx.lineCap = 'round';
      
      // we'll implement this method to start capturing mouse events
      this.captureEvents(canvasEl);
    }

    private captureEvents(canvasEl: HTMLCanvasElement) {
        // this will capture all mousedown events from the canvas element
        fromEvent(canvasEl, 'mousedown')
          .pipe(
            switchMap((e) => {
              // after a mouse down, we'll record all mouse moves
              return fromEvent(canvasEl, 'mousemove')
                .pipe(
                  // we'll stop (and unsubscribe) once the user releases the mouse
                  // this will trigger a 'mouseup' event    
                  takeUntil(fromEvent(canvasEl, 'mouseup')),
                  // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
                  takeUntil(fromEvent(canvasEl, 'mouseleave')),
                  // pairwise lets us get the previous value to draw a line from
                  // the previous point to the current point    
                  pairwise()
                )
            })
          )
          .subscribe((res: [MouseEvent, MouseEvent]) => {
            this.cx.strokeStyle = this.strokeColor;
            const rect = canvasEl.getBoundingClientRect();
      
            // previous and current position with the offset
            const prevPos = {
              x: res[0].clientX - rect.left,
              y: res[0].clientY - rect.top
            };
      
            const currentPos = {
              x: res[1].clientX - rect.left,
              y: res[1].clientY - rect.top
            };

            this.drawingArray.push([currentPos.x/2, currentPos.y/2]);
      
            // this method we'll implement soon to do the actual drawing
            this.drawOnCanvas(prevPos, currentPos);
          });
    }    
    
    private drawOnCanvas(
        prevPos: { x: number, y: number }, 
        currentPos: { x: number, y: number }
      ) {
        // incase the context is not set
        if (!this.cx) { return; }
      
        // start our drawing path
        this.cx.beginPath();
      
        // we're drawing lines so we need a previous position
        if (prevPos) {
          // sets the start point
          this.cx.moveTo(prevPos.x, prevPos.y); // from
      
          // draws a line from the start pos until the current position
          this.cx.lineTo(currentPos.x, currentPos.y);
      
          // strokes the current path with the styles we set earlier
          this.cx.stroke();
        }
    }

    
    async onSubmitCanvas() {
      let sketchImage = new FormData();
      let canvas = document.getElementById('canvas') as HTMLCanvasElement;
      let href: string;

      let promise = new Promise((res, rej) => {
        canvas.toBlob(function(blob: Blob) {
          let file: File = new File([blob], 'sketch.png', {type: 'image/jpg'});
          sketchImage.append('image', file);
          res(file);
        }),
        'image/jpeg'
      })

      let file = await promise;
      
      this.http.post<{'success': any, 'predictions': {'label': Number[], 'confidence': Number}}>(this.imageRecognitionURL, sketchImage)
        .subscribe(result => {
          let guessedPainters = [];
          let classes = ['Leonardo_da_Vinci', 'Michelangelo', 'Mikhail_Vrubel', 'Pablo_Picasso', 'Paul_Cezanne', 'Paul_Gauguin', 'Pierre-Auguste_Renoir', 'Piet_Mondrian', 'Raphael', 'Rembrandt', 'Rene_Magritte', 'Salvador_Dali', 'Titian', 'Vincent_van_Gogh', 'Andrei_Rublev', 'Andy_Warhol', 'Caravaggio', 'Claude_Monet', 'Diego_Rivera', 'Diego_Velazquez', 'Edgar_Degas', 'Edvard_Munch', 'El_Greco', 'Frida_Kahlo', 'Georges_Seurat', 'Gustav_Klimt', 'Henri_Rousseau', 'Jackson_Pollock', 'Jan_van_Eyck', 'Joan_Miro']

          let count = 0
          let win = false;
          let currentPic = this.currentPic;

          result.predictions.label.forEach(function(id:number) {
              guessedPainters[count] = classes[id];
              count++;
          });

          this.guessedPainters = guessedPainters;
        });  

    }

    resetCanvas() {
      this.cx.fillStyle = "white";
      this.cx.fillRect(0, 0, 512, 512);
    } 
    
    
}