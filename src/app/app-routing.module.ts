import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommentCreateComponent } from './comments/comment-create/comment-create.component';
import { CommentDisplayComponent } from './comments/comment-display/comment-display.component';
import { FruitTypes } from './image-recognition/fruit-types/fruit-types.component';
import { DogBreeds } from './image-recognition/dog-breeds/dog-breeds.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { DrawingScreen } from './pictionarAI/drawing-screen/drawing-screen.component';



const routes: Routes = [
    { path: '', component: HomeScreenComponent},
    { path: 'comment', component: CommentCreateComponent},
    { path: 'edit-comment/:commentId', component: CommentCreateComponent},
    { path: 'fruit-types', component: FruitTypes },
    { path: 'dog-breeds', component: DogBreeds },
    { path: 'drawing-canvas', component: DrawingScreen}
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { 
}