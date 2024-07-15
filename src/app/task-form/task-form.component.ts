import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../app/task.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    this.taskForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      dueDate: [data?.dueDate || '', Validators.required],
      priority: [data?.priority || '', Validators.required],
      notes: [data?.notes || ''],
      tags: [data?.tags || []]
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const task = {
        ...this.data,
        ...this.taskForm.value,
        id: this.data ? this.data.id : null,
        tags : [this.data ? [this.taskForm.value.tags.split(' ')] : []],
        completed: this.data ? this.data.completed : false
      };
      this.dialogRef.close(task);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
