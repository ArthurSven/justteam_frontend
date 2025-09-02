import {Component, OnInit} from '@angular/core';
import {Page, User, UserService} from "../../services/user.service";
import {DatePipe, DecimalPipe, NgClass} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-usertable',
  imports: [
    NgClass,
    DecimalPipe,
    DatePipe,
    FormsModule
  ],
  templateUrl: './usertable.component.html',
  standalone: true,
  styleUrl: './usertable.component.css'
})
export class UsertableComponent implements OnInit {
  users: User[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  isLoading: boolean = false;
  selectedUsers: Set<string> = new Set();

  constructor(private userService: UserService) {

  }

  // Add Math reference for template usage
  Math = Math;
  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers(this.currentPage, this.pageSize).subscribe({
      next: (page: Page<User>) => {
        this.users = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.isLoading = false;
        this.selectedUsers.clear(); // Clear selection when data changes
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0; // Reset to first page when changing page size
    this.loadUsers();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(0, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  toggleUserSelection(userId: string): void {
    if (this.selectedUsers.has(userId)) {
      this.selectedUsers.delete(userId);
    } else {
      this.selectedUsers.add(userId);
    }
  }

  toggleSelectAll(): void {
    if (this.selectedUsers.size === this.users.length) {
      this.selectedUsers.clear();
    } else {
      this.users.forEach(user => this.selectedUsers.add(user.userId));
    }
  }

  isAllSelected(): boolean {
    return this.users.length > 0 && this.selectedUsers.size === this.users.length;
  }

  isSomeSelected(): boolean {
    return this.selectedUsers.size > 0 && this.selectedUsers.size < this.users.length;
  }

  getSelectedCount(): number {
    return this.selectedUsers.size;
  }

  getDisplayRange(): { start: number, end: number } {
    const start = this.currentPage * this.pageSize + 1;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
    return { start, end };
  }

}
