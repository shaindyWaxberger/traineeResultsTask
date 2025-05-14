import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { Trainee } from '../Models/Trainee';

interface TraineeStatus extends Trainee {
  status: 'Passed' | 'Failed';
}

@Component({
  selector: 'app-monitor-page',
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatTableModule
  ],
  templateUrl: './monitor-page.component.html',
  styleUrls: ['./monitor-page.component.css']
})
export class MonitorPageComponent implements OnInit {
  allTrainees: TraineeStatus[] = [];
  filteredTrainees: TraineeStatus[] = [];
  
  selectedIds: number[] = [];
  nameFilter: string = '';
  showPassed: boolean = true;
  showFailed: boolean = true;

  displayedColumns: string[] = ['id', 'name', 'averageGrade', 'exams'];
  
  ngOnInit() {
    this.loadData();
    this.applyFilters();
    this.selectedIds  = this.allTrainees.map(t => t.id); // Select all by default
  }

  loadData() {
    const trainees = [
      { id: 1, name: 'Morgan', subject: 'Algabra', grade: 85, date: new Date('2024-05-13'),exams:6 },
      { id: 2, name: 'Shalom', subject: 'English', grade: 62, date: new Date('2024-08-12'),exams:6 },
      { id: 3, name: 'Yosef', subject: 'Math', grade: 64, date: new Date('2025-05-13'),exams:6 }
    ];

    this.allTrainees = trainees.map(t => ({
      ...t,
      averageGrade: t.grade, // In real app, calculate average from multiple grades
      status: t.grade >= 65 ? 'Passed' : 'Failed'
    }));
  }

  applyFilters() {
    this.filteredTrainees = this.allTrainees.filter(trainee => {
      const matchesId = this.selectedIds.length === 0 || 
                       this.selectedIds.includes(trainee.id);
      
      const matchesName = !this.nameFilter || 
                         trainee.name.toLowerCase().includes(this.nameFilter.toLowerCase());
      
      const matchesStatus = (trainee.status === 'Passed' && this.showPassed) ||
                           (trainee.status === 'Failed' && this.showFailed);

      return matchesId && matchesName && matchesStatus;
    });
  }

  onFilterChange() {
    this.applyFilters();
  }
}