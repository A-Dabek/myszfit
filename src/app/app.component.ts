import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { map } from 'rxjs';
import { ActivityComponent, ActivityViewModel } from './activity.component';
import { HeaderComponent } from './header.component';
import { ProgressComponent } from './progress/progress.component';
import { StateService } from './state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, ProgressComponent, HeaderComponent, ActivityComponent],
  template: `
    <main class="bg-gray-100 min-h-svh flex flex-col justify-between py-14 ">
      <app-header class="block cormorant-garamond-regular" />
      <div class="flex flex-col items-center justify-center">
        <div class="flex flex-col space-y-4">
          @for (activity of activities$ | async; track activity.id) {
            <app-activity
              class="flex items-center space-x-4"
              [activity]="activity"
              (trackClick)="onTrackClick(activity.id)"
              (dateChanged)="onDateChanged(activity.id, $event)"
            />
          }
        </div>
      </div>
      <div class="mt-5 flex items-center justify-center">
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
          timestamp: activity.lastDate,
          lastDate: isInThisWeek(date)
            ? new Date(activity.lastDate).toLocaleDateString('pl', {
                weekday: 'long',
              })
            : '',
        } as ActivityViewModel;
      }),
    ),
  );

  readonly progress$ = this.activities$.pipe(
    map((activities) => {
      return (
        activities.filter((activity) => !!activity.lastDate).length /
        activities.length
      );
    }),
  );

  onTrackClick(id: string) {
    this.stateService.updateActivityDate(id, 0);
  }

  onDateChanged(id: string, offset: number) {
    this.stateService.updateActivityDate(id, offset); // Update the actual date in state
  }
}
