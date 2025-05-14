import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Trainee } from '../Models/Trainee';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { TraineesService } from '../services/trainees-sevice';
import { NgxChartsModule } from '@swimlane/ngx-charts';

export interface ChartData {
  id: number;
  title: string;
  visible: boolean;
  data: any[];
}
@Component({
  selector: 'app-analysis-page',
  imports: [NgxChartsModule, MatIconModule, DragDropModule, MatSelectModule, CommonModule, MatFormFieldModule, FormsModule],
  templateUrl: './analysis-page.component.html',
  styleUrl: './analysis-page.component.css'
})

export class AnalysisPageComponent implements OnInit {
  selectedIds: number[] = [];
  selectedSubjects: string[] = [];
  allTrainees: Trainee[] = [];
  uniqueSubjects: string[] = [];


  charts: ChartData[] = [
    {
      id: 1,
      title: 'Students averages for students with chosen id',
      visible: true,
      data: []
    },
    {
      id: 2,
      title: 'Grades Avarage over time for studens with Id',
      visible: true,
      data: []
    },
    {
      id: 3,
      title: 'Grades Avarage per subject',
      visible: false,
      data: []
    }
  ];

  visibleCharts = this.charts.filter(c => c.visible);
  hiddenChart = this.charts.find(c => !c.visible);

  constructor(private traineesService: TraineesService) {
  }
  
  ngOnInit() {
    this.allTrainees = this.traineesService.getTrainees();
    this.selectedIds= this.allTrainees.map(t => t.id);
    this.uniqueSubjects = [...new Set(this.allTrainees.map(t => t.subject))];
    this.selectedSubjects = this.uniqueSubjects;
    this.updateChartsData();
  }

  onFilterChange() {
    this.updateChartsData();
  }

  onChartDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.visibleCharts, event.previousIndex, event.currentIndex);
    } else {
      if (event.previousContainer.id === 'hidden-chart'
        && event.container.id === 'visible-charts') {
        const chartToHide = this.visibleCharts[event.currentIndex];
        const chart = this.visibleCharts.find(c => c.id == chartToHide.id);
        if (chart && this.hiddenChart) {
          chart.visible = false;
          this.hiddenChart.visible = true;
        }
        this.visibleCharts = this.charts.filter(c => c.visible);
        this.hiddenChart = this.charts.find(c => !c.visible);
      }
    }
  }

  updateChartsData() {
    if (this.selectedIds.length > 0) {
      const gradesData = this.allTrainees
        .filter(t => this.selectedIds.includes(t.id))
        .map(t => ({
          name: t.name,
          value: t.grade
        }));

      this.charts[0].data = gradesData;

      const progressData = this.selectedIds.map(id => {
        const traineeGrades = this.allTrainees
          .filter(t => t.id === id)
          .map(t => ({
            name: new Date(t.date).toLocaleDateString(),
            value: t.grade
          }));
        return {
          name: `Trainee ${id}`,
          series: traineeGrades
        };
      });

      this.charts[1].data = progressData;
    }
    else {
      this.charts[0].data = [];
      this.charts[1].data = [];
    }

    if (this.selectedSubjects.length > 0) {
      const subjectData = this.selectedSubjects.map(subject => {
        const grades = this.allTrainees
          .filter(t => t.subject === subject)
          .map(t => t.grade);

        return {
          name: subject,
          value: grades.reduce((a, b) => a + b, 0) / grades.length
        };
      });

      this.charts[2].data = subjectData;
    }
    else {
      this.charts[2].data = [];
    }
  }
}
