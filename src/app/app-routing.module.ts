import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CommentCreateComponent } from './comments/comment-create/comment-create.component';
import { SignupComponent } from './auth/signup/singup.component';
import { CommentDisplayComponent } from './comments/comment-display/comment-display.component';
import { FruitTypes } from './image-recognition/fruit-types/fruit-types.component';



const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'signup', component: SignupComponent},
    { path: 'comment', component: CommentCreateComponent},
    { path: 'edit-comment/:commentId', component: CommentCreateComponent},
    { path: 'fruit-types', component: FruitTypes }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}