import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommentCreateComponent } from './comments/comment-create/comment-create.component';
import { CommentDisplayComponent } from './comments/comment-display/comment-display.component';
import { AttractivenessRating } from './image-recognition/attractiveness/attractiveness.component';
import { DogBreeds } from './image-recognition/dog-breeds/dog-breeds.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { DrawingScreen } from './pictionarAI/drawing-screen/drawing-screen.component';
import { RPSGame } from './rock-paper-scissors/game/rps-game.components';
import { MadLibs } from './mad-libs/game/mad-libs.component';
import { RPSPreview } from './rock-paper-scissors/preview/rps-preview.component';
import { MadLibsIntro } from './mad-libs/intro/mad-libs-intro.component';
import { PictionarAIIntro } from './pictionarAI/intro/pictionarAI-intro.component';
import { Animation } from './image-recognition/animation/animation.component';



const routes: Routes = [
    { path: '', component: HomeScreenComponent},
    { path: 'comment', component: CommentCreateComponent},
    { path: 'comment-display', component: CommentDisplayComponent},
    { path: 'edit-comment/:commentId', component: CommentCreateComponent},
    { path: 'attractiveness', component: AttractivenessRating },
    { path: 'dog-breeds', component: DogBreeds },
    { path: 'drawing-canvas', component: DrawingScreen},
    { path: 'pictionarAI-intro', component: PictionarAIIntro},
    { path: 'rps-game', component: RPSGame},
    { path: 'madlibs', component: MadLibs},
    { path: 'madlibs-intro', component: MadLibsIntro},
    { path: 'rps-preview', component: RPSPreview },
    { path: 'animation', component: Animation}
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { 
}