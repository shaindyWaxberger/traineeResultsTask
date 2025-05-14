import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Trainee } from '../../Models/Trainee';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-trainee-table',
  imports: [DatePipe,MatTableModule,CommonModule,MatInputModule,MatFormFieldModule],
  templateUrl: './trainee-table.component.html',
  styleUrl: './trainee-table.component.css'
})
export class TraineeTableComponent implements OnInit{
  @Input() data: Trainee[] = [];
  @Input() selectedId?: number;
  @Output() rowSelected = new EventEmitter<Trainee>();
  displayedColumns: string[] = ['id', 'name', 'subject', 'grade', 'date'];

  paginatedData: Trainee[] = [];
  currentPage = 0;
  pageSize = 10;

  ngOnInit() {
    this.updatePagination();
  }

  ngOnChanges() {
    this.updatePagination();
  }

  updatePagination() {
    const start = this.currentPage * this.pageSize;
    this.paginatedData = this.data.slice(start, start + this.pageSize);
  }

  onRowClick(trainee: Trainee) {
    this.rowSelected.emit(trainee);
  }

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.data.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagination();
    }
  }
  
}