import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { AnalysisPageComponent } from './analysis-page/analysis-page.component';
import { MonitorPageComponent } from './monitor-page/monitor-page.component';
import { DataPageComponent } from './data-page/data-page.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [MatTabsModule,AnalysisPageComponent,MonitorPageComponent,DataPageComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'trainee-results-task';
}
