import { AsyncPipe, NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { StateService } from './state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgForOf, AsyncPipe],
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
              class="px-4 py-2 bg-blue-500 text-white rounded w-40"
              (click)="trackClick(activity.id)"
            >
              {{ activity.name }}
            </button>
            <span>{{ activity.lastDate }}</span>
          </div>
        </div>
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

  readonly activities$ = this.stateService.activities$;

  trackClick(id: string) {
    this.stateService.updateActivityDate(id);
  }
}
