import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../../app/task.service';
import { Task } from '../../app/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchTerm: string = '';
  showCompleted: boolean = false;

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe(tasks => {
      console.log('Tasks loaded in TaskListComponent:', tasks);
      this.tasks = tasks;
      this.filterTasks();
    });
  }

  filterTasks(): void {
    this.filteredTasks = this.tasks.filter(task => {
      return (
        (this.showCompleted || !task.completed) &&
        task.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue.trim().toLowerCase();
    this.filterTasks();
  }

  openTaskForm(task?: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '400px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (task) {
          this.taskService.updateTask(result);
        } else {
          result.id = this.tasks.length + 1;
          result.completed = false;
          this.taskService.addTask(result);
        }
      }
    });
  }

  markAsCompleted(task: Task): void {
    task.completed = !task.completed;
    this.taskService.updateTask(task);
  }

  confirmDelete(taskId: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(taskId);
      }
    });
  }

  editTask(task: Task): void {
    this.openTaskForm(task);
  }
}

@Component({
  selector: 'delete-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h1 mat-dialog-title>Are you sure?</h1>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button (click)="onYesClick()">Confirm</button>
    </div>
  `
})
export class DeleteConfirmDialog {
  constructor(public dialogRef: MatDialogRef<DeleteConfirmDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
