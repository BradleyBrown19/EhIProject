import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { Simplify, ISimplifyArrayPoint} from 'simplify-ts';

import { MatInputModule, MatGridListModule, MatCardModule, MatButtonModule, MatToolbarModule, MatExpansionModule, MatPaginatorModule, MatSelect, MatOption, MatSelectModule } from '@angular/material';
import {MatMenuModule} from '@angular/material/menu';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CommentDisplayComponent } from './comments/comment-display/comment-display.component';
import { CommentCreateComponent } from './comments/comment-create/comment-create.component';
import { HeaderComponent } from './header/header.component';

import { DragScrollModule } from 'ngx-drag-scroll';
import { SlotMachineButtonModule } from 'ng-slot-machine-button';


import { AppRoutingModule } from './app-routing.module';
import { NbThemeModule, NbLayoutModule, NbSidebarModule, NbActionsModule, NbCardModule, NbSearchModule, NbMenuModule } from '@nebular/theme';
import { AttractivenessRating } from './image-recognition/attractiveness/attractiveness.component';
import { DogBreeds } from './image-recognition/dog-breeds/dog-breeds.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { DrawingScreen } from './pictionarAI/drawing-screen/drawing-screen.component';

import { AdsenseModule } from 'ng2-adsense';

import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { EndPictionaraiModal } from './pictionarAI/game-over-modal/modal.component';
import { RPSGame } from './rock-paper-scissors/game/rps-game.components';
import { MadLibs } from './mad-libs/mad-libs.component';
import { RPSPreview } from './rock-paper-scissors/preview/rps-preview.component'


@NgModule({
  declarations: [
    AppComponent,
    CommentCreateComponent,
    HeaderComponent,
    CommentDisplayComponent,
    AttractivenessRating,
    DogBreeds,
    HomeScreenComponent,
    DrawingScreen,
    EndPictionaraiModal,
    MadLibs,
    RPSPreview,
    RPSGame
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbSidebarModule,
    NbLayoutModule,
    NbActionsModule,
    NbCardModule,
    MatSelectModule,
    NbSearchModule,
    MatPaginatorModule,
    DragScrollModule,
    SlotMachineButtonModule,
    MatMenuModule,
    MatGridListModule,
    NbMenuModule.forRoot(),
    NgxSmartModalModule.forRoot(),
    AdsenseModule.forRoot({
      adClient: "ca-pub-4251042441587231",
      adSlot: 7259870550,
    }),
  ],
  providers: [NgxSmartModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
