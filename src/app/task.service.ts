// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../app/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    // Add initial tasks for testing if none exist
    if (tasks.length === 0) {
      tasks.push(
        {
          id: 1,
          name: 'Sample Task 1',
          dueDate: new Date(),
          priority: 'High',
          notes: 'This is a sample task.',
          tags: ['sample'],
          completed: false,
        },
        {
          id: 2,
          name: 'Sample Task 2',
          dueDate: new Date(),
          priority: 'Medium',
          notes: 'This is another sample task.',
          tags: ['sample'],
          completed: true,
        }
      );
      this.updateTasks(tasks);
    } else {
      this.tasksSubject.next(tasks);
    }
  }

  getTasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.updateTasks(tasks);
  }

  updateTask(updatedTask: Task): void {
    const tasks = this.getTasks().map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.updateTasks(tasks);
  }

  deleteTask(id: number): void {
    const tasks = this.getTasks().filter(task => task.id !== id);
    this.updateTasks(tasks);
  }

  updateTasks(tasks: Task[]): void {
    console.log('Updating tasks in localStorage:', tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }

}
