import { AsyncPipe, NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { map } from 'rxjs';
import { ProgressComponent } from './progress/progress.component';
import { StateService } from './state.service';

export interface ActivityViewModel {
  id: string;
  name: string;
  lastDate: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgForOf, AsyncPipe, ProgressComponent],
  template: `
    <main class="bg-gray-100 min-h-screen ">
      <h1 class="text-center text-xl font-bold mb-6">
        Dzisiaj {{ currentDay() }}
      </h1>
      <div class="flex flex-col items-center justify-center">
        <div class="flex flex-col space-y-4">
          <div
            *ngFor="let activity of activities$ | async; let i = index"
            class="flex items-center space-x-4"
          >
            <button
              style="background-color: #d40b5b"
              class="px-4 py-2 bg-blue-500 text-white rounded w-40"
              (click)="trackClick(activity.id)"
            >
              {{ activity.name }}
            </button>
            <span>{{ activity.lastDate || '🤸' }}</span>
          </div>
        </div>
      </div>
      <div class="mt-5 flex-grow flex items-center justify-center">
        <app-progress
          style="zoom: 2"
          [progress]="(progress$ | async) || 0"
        ></app-progress>
      </div>
    </main>
  `,
})
export class AppComponent {
  readonly stateService = inject(StateService);

  readonly currentDay = computed(() => {
    return new Date().toLocaleDateString('pl', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  });

  readonly activities$ = this.stateService.activities$.pipe(
    map((activities) =>
      activities.map((activity) => {
        const date = new Date(activity.lastDate);
        const startOfWeek = new Date();
        const today = new Date();

        // Adjust the start of the week to Monday
        startOfWeek.setDate(
          today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1),
        );
        startOfWeek.setHours(0, 0, 0, 0);

        // Check if the date is in the current week
        const isInThisWeek = (date: Date): boolean => {
          return date >= startOfWeek;
        };

        // Example usage within your map function
        return {
          name: activity.name,
          id: activity.id,
          lastDate: isInThisWeek(date)
            ? new Date(activity.lastDate).toLocaleDateString('pl', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })
            : '',
        } as ActivityViewModel;
      }),
    ),
  );

  readonly progress$ = this.activities$.pipe(
    map((activities) => {
      console.log(activities);
      return activities.filter((activity) => !!activity.lastDate).length / 4.0;
    }),
  );

  trackClick(id: string) {
    this.stateService.updateActivityDate(id);
  }
}
