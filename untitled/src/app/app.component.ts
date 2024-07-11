import {CommonModule} from '@angular/common';
import { Component } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import {MainComponent} from './components/main/main.component';
import { SvgIconComponent, provideAngularSvgIcon } from 'angular-svg-icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainComponent, SvgIconComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'untitled';
}
