
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
    selector: 'drawing-screen',
    templateUrl: './drawing-screen.component.html',
    styleUrls: ['./drawing-screen.component.scss']
})
export class DrawingScreen implements AfterViewInit, OnInit {
    @ViewChild('canvas') public canvas: ElementRef;
    drawingArray: Array<[number, number]> = [];
    points: ISimplifyArrayPoint[] = [];
    imageRecognitionURL: string = pythonApi + "/predict-draw";
    file: File;
    prediction: {'label': string, 'confidence': Number};
    subscription: Subscription;
    currentPic: String;
    time: number;

    constructor (public ngxSmartModalService: NgxSmartModalService, private http: HttpClient, private router: Router) {}

    ngOnInit() {
      const source = interval(1000);
      this.time = 20;
      let randomInt = Math.floor(Math.random() * 340);
      this.currentPic = this.classes[randomInt];
      this.subscription = source.subscribe(val => this.onSubmitCanvas());
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

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
        this.cx.fillStyle = "black";
        this.cx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    
        // set some default properties about the line
        this.cx.lineWidth = 3;
        this.cx.lineCap = 'round';
        this.cx.strokeStyle = 'white';
        
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
      console.log(this.imageRecognitionURL);
      this.http.post<{'success': any, 'predictions': {'label': string, 'confidence': Number}}>(this.imageRecognitionURL, sketchImage)
        .subscribe(result => {
          console.log('result:');
          console.log(result);
            this.prediction = result.predictions;
            if (this.prediction.label == this.currentPic) {
              this.gameOver(true);
            } else if (this.time == 0) {
              this.gameOver(false);
            }
            this.time = this.time - 1;
        });  

    }

    resetCanvas() {
      this.cx.fillStyle = "black";
      this.cx.fillRect(0, 0, 512, 512);
    }

    gameOver(win) {
      const obj: {win: boolean, image: String, guess: String} = {
        win: true,
        image: (document.getElementById('canvas') as HTMLCanvasElement).toDataURL(),
        guess: this.prediction.label
      };
      //open up console with win or lose message and play again or quit form
        if (win) {
          console.log('YOU WON');
          
        } else {
          obj.win = false;
        }
    
        this.ngxSmartModalService.setModalData(obj, 'myModal');
        
        this.ngxSmartModalService.getModal('myModal').open()

        this.subscription.unsubscribe();
    }
    
    classes: String[] = ['aircraft carrier', 'airplane', 'alarm clock', 'ambulance', 'angel', 'animal migration', 'ant', 'anvil', 'apple', 'arm', 'asparagus', 'axe', 'backpack', 'banana', 'bandage', 'barn', 'baseball', 'baseball bat', 'basket', 'basketball', 'bat', 'bathtub', 'beach', 'bear', 'beard', 'bed', 'bee', 'belt', 'bench', 'bicycle', 'binoculars', 'bird', 'birthday cake', 'blackberry', 'blueberry', 'book', 'boomerang', 'bottlecap', 'bowtie', 'bracelet', 'brain', 'bread', 'bridge', 'broccoli', 'broom', 'bucket', 'bulldozer', 'bus', 'bush', 'butterfly', 'cactus', 'cake', 'calculator', 'calendar', 'camel', 'camera', 'camouflage', 'campfire', 'candle', 'cannon', 'canoe', 'car', 'carrot', 'castle', 'cat', 'ceiling fan', 'cello', 'cell phone', 'chair', 'chandelier', 'church', 'circle', 'clarinet', 'clock', 'cloud', 'coffee cup', 'compass', 'computer', 'cookie', 'cooler', 'couch', 'cow', 'crab', 'crayon', 'crocodile', 'crown', 'cruise ship', 'cup', 'diamond', 'dishwasher', 'diving board', 'dog', 'dolphin', 'donut', 'door', 'dragon', 'dresser', 'drill', 'drums', 'duck', 'dumbbell', 'ear', 'elbow', 'elephant', 'envelope', 'eraser', 'eye', 'eyeglasses', 'face', 'fan', 'feather', 'fence', 'finger', 'fire hydrant', 'fireplace', 'firetruck', 'fish', 'flamingo', 'flashlight', 'flip flops', 'floor lamp', 'flower', 'flying saucer', 'foot', 'fork', 'frog', 'frying pan', 'garden', 'garden hose', 'giraffe', 'goatee', 'golf club', 'grapes', 'grass', 'guitar', 'hamburger', 'hammer', 'hand', 'harp', 'hat', 'headphones', 'hedgehog', 'helicopter', 'helmet', 'hexagon', 'hockey puck', 'hockey stick', 'horse', 'hospital', 'hot air balloon', 'hot dog', 'hot tub', 'hourglass', 'house', 'house plant', 'hurricane', 'ice cream', 'jacket', 'jail', 'kangaroo', 'key', 'keyboard', 'knee', 'knife', 'ladder', 'lantern', 'laptop', 'leaf', 'leg', 'light bulb', 'lighter', 'lighthouse', 'lightning', 'line', 'lion', 'lipstick', 'lobster', 'lollipop', 'mailbox', 'map', 'marker', 'matches', 'megaphone', 'mermaid', 'microphone', 'microwave', 'monkey', 'moon', 'mosquito', 'motorbike', 'mountain', 'mouse', 'moustache', 'mouth', 'mug', 'mushroom', 'nail', 'necklace', 'nose', 'ocean', 'octagon', 'octopus', 'onion', 'oven', 'owl', 'paintbrush', 'paint can', 'palm tree', 'panda', 'pants', 'paper clip', 'parachute', 'parrot', 'passport', 'peanut', 'pear', 'peas', 'pencil', 'penguin', 'piano', 'pickup truck', 'picture frame', 'pig', 'pillow', 'pineapple', 'pizza', 'pliers', 'police car', 'pond', 'pool', 'popsicle', 'postcard', 'potato', 'power outlet', 'purse', 'rabbit', 'raccoon', 'radio', 'rain', 'rainbow', 'rake', 'remote control', 'rhinoceros', 'rifle', 'river', 'roller coaster', 'rollerskates', 'sailboat', 'sandwich', 'saw', 'saxophone', 'school bus', 'scissors', 'scorpion', 'screwdriver', 'sea turtle', 'see saw', 'shark', 'sheep', 'shoe', 'shorts', 'shovel', 'sink', 'skateboard', 'skull', 'skyscraper', 'sleeping bag', 'smiley face', 'snail', 'snake', 'snorkel', 'snowflake', 'snowman', 'soccer ball', 'sock', 'speedboat', 'spider', 'spoon', 'spreadsheet', 'square', 'squiggle', 'squirrel', 'stairs', 'star', 'steak', 'stereo', 'stethoscope', 'stitches', 'stop sign', 'stove', 'strawberry', 'streetlight', 'string bean', 'submarine', 'suitcase', 'sun', 'swan', 'sweater', 'swing set', 'sword', 'syringe', 'table', 'teapot', 'teddy-bear', 'telephone', 'television', 'tennis racquet', 'tent', 'The Eiffel Tower', 'The Great Wall of China', 'The Mona Lisa', 'tiger', 'toaster', 'toe', 'toilet', 'tooth', 'toothbrush', 'toothpaste', 'tornado', 'tractor', 'traffic light', 'train', 'tree', 'triangle', 'trombone', 'truck', 'trumpet', 't-shirt', 'umbrella', 'underwear', 'van', 'vase', 'violin', 'washing machine', 'watermelon', 'waterslide', 'whale', 'wheel', 'windmill', 'wine bottle', 'wine glass', 'wristwatch', 'yoga', 'zebra']
    
}