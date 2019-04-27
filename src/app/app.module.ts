import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule, MatExpansionModule } from '@angular/material';

import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CommentDisplayComponent } from './comments/comment-display/comment-display.component';
import { CommentCreateComponent } from './comments/comment-create/comment-create.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './auth/login/login.component';


import { AppRoutingModule } from './app-routing.module';
import { SignupComponent } from './auth/signup/singup.component';
import { NbThemeModule, NbLayoutModule, NbSidebarModule, NbActionsModule, NbCardModule, NbSearchModule } from '@nebular/theme';



@NgModule({
  declarations: [
    AppComponent,
    CommentCreateComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    CommentDisplayComponent
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
    HttpClientModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbSidebarModule,
    NbLayoutModule,
    NbActionsModule,
    NbCardModule,
    NbSearchModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
