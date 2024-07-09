import {CommonModule} from '@angular/common';
import { Component } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import {MainComponent} from './components/main/main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'untitled';
}
