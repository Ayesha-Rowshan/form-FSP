import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationappComponent } from './registrationapp/registrationapp.component';
import { FormsModule } from '@angular/forms';
import { KeyPipe } from './registrationapp/key.pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RegistrationappComponent, KeyPipe],
})
export class AppComponent implements OnInit {
  Math = Math;
  isModalOpen = false;
  studentToEdit: any = null;
  studentData: any[] = [];
  filteredData: any[] = [];
  localStorageKey = 'studentData';
  isFormOpen: boolean = false;

  currentPage = 1;
  itemsPerPage = 5;
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' | null = null;
  filterQuery = '';
  paginatedData: any[] = [];

  ngOnInit() {
    const savedData = localStorage.getItem(this.localStorageKey);
    if (savedData) {
      this.studentData = JSON.parse(savedData);
      this.filteredData = [...this.studentData];
    }
    this.applyFilters();
  }

  openRegistrationForm() {
    this.isModalOpen = true;
    this.studentToEdit = null;
  }

  closeRegistrationForm() {
    this.isModalOpen = false;
  }

  addOrUpdateStudent(student: any) {
    if (this.studentToEdit) {
      const index = this.studentData.findIndex((s) => s.email === this.studentToEdit.email);
      if (index > -1) {
        this.studentData[index] = student;
      }
    } else {
      this.studentData.push(student);
    }
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.studentData));
    this.currentPage = Math.ceil(this.studentData.length / this.itemsPerPage);
    this.applyFilters();
    this.closeRegistrationForm();
  }

  editStudent(index: number) {
    this.studentToEdit = { ...this.filteredData[index] };
    this.isModalOpen = true;
  }

  deleteStudent(index: number) {
    const studentIndex = this.studentData.findIndex((s) => s.email === this.filteredData[index].email);
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentData.splice(studentIndex, 1);
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.studentData));
      this.applyFilters();
    }
  }

  onFilterQueryChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.filterQuery
      ? this.studentData.filter((student) => {
          return Object.keys(student).some(key =>
            student[key]?.toString().toLowerCase().includes(this.filterQuery.toLowerCase())
          );
        })
      : [...this.studentData];

 
    if (this.sortColumn && this.sortDirection) {
      filtered.sort((a, b) => {
        const valueA = a[this.sortColumn!] || '';
        const valueB = b[this.sortColumn!] || '';
        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    this.filteredData = filtered;
    this.paginate();
  }

  paginate() {
 
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(start, end);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.paginate();
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else { 
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a, b) => {
      const valueA = a[column]?.toString().toLowerCase() || '';
      const valueB = b[column]?.toString().toLowerCase() || '';

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.paginate();
  }

  sortAllData(direction: 'asc' | 'desc') {
    const compareFn = (a: any, b: any) => {
      const valueA = Object.values(a).join(' ').toLowerCase();
      const valueB = Object.values(b).join(' ').toLowerCase();

      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    };
    this.studentData.sort(compareFn);
    this.applyFilters();
  }
}
