import { ChangeDetectorRef, Component } from '@angular/core';
import { Trainee } from '../Models/Trainee';
import { CommonModule } from '@angular/common';
import { TraineeTableComponent } from '../shared/trainee-table/trainee-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TraineesService } from '../services/trainees-sevice';

@Component({
  selector: 'app-data-page',
  imports: [
    MatInputModule,
    FormsModule,
    CommonModule,
    TraineeTableComponent,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [TraineesService],
  templateUrl: './data-page.component.html',
  styleUrl: './data-page.component.css'
})

export class DataPageComponent {
  allResults: Trainee[] = [];
  filteredResults: Trainee[] = [];
  selectedTrainee?: Trainee;
  filterText = '';
  Math = Math;
  pageSize = 10;
  currentPage = 1;

  constructor(private cd: ChangeDetectorRef,private traineesService:TraineesService) {
    this.allResults = this.traineesService.getTrainees();
    this.filteredResults = [...this.allResults];
  }

  get paginatedResults() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredResults.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredResults.length / this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }

  getPageNumbers(): number[] {
    const pages = Math.ceil(this.filteredResults.length / this.pageSize);
    return Array.from({ length: pages }, (_, i) => i + 1);
  }

  onFilterChange(text: string) {
    this.filterText = text;
    this.currentPage = 1;
    this.filteredResults = this.filterData(text);
    this.cd.detectChanges();
  }

  filterData(text: string): Trainee[] {
    if (!text) return this.allResults;

    const lower = text.toLowerCase().trim();

    return this.allResults.filter(item => {
      if (lower.startsWith('id:')) {
        const id = Number(lower.slice(3).trim());
        return !isNaN(id) && item.id === id;
      }

      if (lower.startsWith('>') || lower.startsWith('<')) {
        const operator = lower[0];
        const value = Number(lower.slice(1).trim());
        if (!isNaN(value)) {
          return operator === '>' ? item.grade > value : item.grade < value;
        }
      }
      if (lower.includes('date:')) {
        const dateStr = lower.split('date:')[1].trim();
        if (dateStr.startsWith('>') || dateStr.startsWith('<')) {
          const operator = dateStr[0];
          const date = new Date(dateStr.slice(1).trim());
          if (!isNaN(date.getTime())) {
            return operator === '>'
              ? item.date > date
              : item.date < date;
          }
        }
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          return item.date.toDateString() === date.toDateString();
        }
      }

      return Object.values(item).some(val =>
        val?.toString().toLowerCase().includes(lower)
      );
    });
  }

  onRowSelected(trainee: Trainee) {
    this.selectedTrainee = JSON.parse(JSON.stringify(trainee));
  }

  onSave(updated: Trainee) {
    const index = this.allResults.findIndex(r => r.id === updated.id);
    if (index !== -1) this.allResults[index] = { ...updated };
    this.filteredResults = this.filterData(this.filterText);
    this.selectedTrainee = undefined;
    this.cd.detectChanges();
  }

  onAdd() {
    const newId = Math.max(...this.allResults.map(r => r.id), 0) + 1;
    const newTrainee: Trainee = {
      id: newId,
      name: '',
      subject: '',
      grade: 0,
      date: new Date()
    };
    this.allResults.unshift(newTrainee);
    this.filteredResults = this.filterData(this.filterText);
    this.selectedTrainee = JSON.parse(JSON.stringify(newTrainee));
  }

  onRemove() {
    if (!this.selectedTrainee) return;
    this.allResults = this.allResults.filter(t => t.id !== this.selectedTrainee?.id);
    this.filteredResults = this.filterData(this.filterText);
    this.selectedTrainee = undefined;
  }
}