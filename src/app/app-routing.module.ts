import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CommentCreateComponent } from './comments/comment-create/comment-create.component';
import { SignupComponent } from './auth/signup/singup.component';
import { CommentDisplayComponent } from './comments/comment-display/comment-display.component';



const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'signup', component: SignupComponent},
    { path: 'comment', component: CommentCreateComponent},
    { path: 'edit-comment/:commentId', component: CommentCreateComponent}
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}