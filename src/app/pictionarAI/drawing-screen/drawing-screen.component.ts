
import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'
import { SimplifyAP, ISimplifyArrayPoint } from 'simplify-ts';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
var dataURLtoBlob = require('blueimp-canvas-to-blob');


@Component({
    selector: 'drawing-screen',
    templateUrl: './drawing-screen.component.html',
    styleUrls: ['./drawing-screen.component.css']
})
export class DrawingScreen implements AfterViewInit {
    @ViewChild('canvas') public canvas: ElementRef;
    drawingArray: Array<[number, number]> = [];
    points: ISimplifyArrayPoint[] = [];
    imageRecognitionURL: string = "http://127.0.0.1:5000/predict-draw";
    file: File;
    prediction: {'label': string, 'confidence': Number};

    constructor (private http: HttpClient, private router: Router) {}

    @Input() public width = 512;
    @Input() public height = 512;

    private cx: CanvasRenderingContext2D;  

    public ngAfterViewInit() {
        // get the context
        const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
        this.cx = canvasEl.getContext('2d');
    
        // set the width and height
        canvasEl.width = this.width;
        canvasEl.height = this.height;
        this.cx.fillStyle = "white";
        this.cx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    
        // set some default properties about the line
        this.cx.lineWidth = 3;
        this.cx.lineCap = 'round';
        this.cx.strokeStyle = '#000';
        
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
      console.log('pressed');

      let sketchImage = new FormData();
      let canvas = document.getElementById('canvas') as HTMLCanvasElement;
      let href: string;

      let promise = new Promise((res, rej) => {
        canvas.toBlob(function(blob: Blob) {
          href = URL.createObjectURL(blob);
          let file: File = new File([blob], 'sketch.png', {type: 'image/jpg'});
          console.log(file);
          
          sketchImage.append('image', file);
          res(file);
          console.log(href);
        }),
        'image/jpeg'
      })

      let file = await promise;
      
      console.log(file);
      

      this.http.post<{'success': any, 'predictions': {'label': string, 'confidence': Number}}>(this.imageRecognitionURL, sketchImage)
        .subscribe(result => {
            this.prediction = result.predictions;
            console.log(result);
        });  

    }
    

    
}