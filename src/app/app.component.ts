import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
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
  lastDate: string | null;
}

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgForOf, AsyncPipe, ProgressComponent, NgIf],
  template: `
    <main class="bg-gray-100 min-h-screen">
      <h1 class="text-center text-xl font-bold mb-6">
        Dzisiaj {{ currentDay() }}
      </h1>
      <div class="flex flex-col items-center justify-center">
        <div class="flex flex-col space-y-4">
          <div
            *ngFor="let activity of activities$ | async; let i = index"
            class="flex items-center space-x-4"
          >
            <!-- Activity Button -->
            <button
              style="background-color: #d40b5b"
              class="px-4 py-2 bg-blue-500 text-white rounded w-40"
              (click)="trackClick(activity.id)"
            >
              {{ activity.name }}
            </button>

            <!-- Interactive Date -->
            <div class="flex flex-col">
              <div
                class="flex items-center space-x-2 relative"
                (click)="toggleSlider(activity.id)"
              >
                <span class="text-gray-700">
                  {{ activity.lastDate || '🤸' }}
                </span>
                <svg
                  class="w-4 h-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </div>

              <!-- Date Adjustment Slider -->
              <input
                *ngIf="sliderVisibleId === activity.id"
                type="range"
                min="-5"
                style="accent-color: #d40b5b"
                max="5"
                step="1"
                [value]="0"
                class="slider w-32"
                (input)="adjustDate($any($event.target).value, activity.id)"
              />
            </div>
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

  sliderVisibleId: string | null = null; // Tracks which slider is currently visible

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
      return activities.filter((activity) => !!activity.lastDate).length / 4.0;
    }),
  );

  trackClick(id: string) {
    this.stateService.updateActivityDate(id);
  }

  // Toggle the visibility of the slider for a specific activity
  toggleSlider(activityId: string) {
    this.sliderVisibleId =
      this.sliderVisibleId === activityId ? null : activityId;
  }

  // Adjust the date based on the slider value
  adjustDate(dayDelta: string, activityId: string) {
    const dayOffset = parseInt(dayDelta, 10); // Convert slider value to a number
    this.stateService.updateActivityDate(activityId, dayOffset);
  }
}
