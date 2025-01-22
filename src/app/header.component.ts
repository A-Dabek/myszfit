import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-center text-2xl mb-0">
      {{ currentDay() }}
    </h1>
  `,
})
export class HeaderComponent {
  readonly currentDay = computed(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1),
    );
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startOfWeekFormatted = startOfWeek.toLocaleDateString('pl', {
      day: 'numeric',
      month: 'long',
    });

    const endOfWeekFormatted = endOfWeek.toLocaleDateString('pl', {
      day: 'numeric',
      month: 'long',
    });

    return `${startOfWeekFormatted} - ${endOfWeekFormatted}`;
  });
}
