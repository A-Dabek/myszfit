import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit,
} from '@angular/core';
import confetti from 'canvas-confetti';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-congratulations',
  template: ` <div class="confetti-container"></div> `,
  styles: [
    `
      .confetti-container {
        position: relative;
        overflow: hidden;
      }
    `,
  ],
})
export class CongratulationsComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.startConfettiEffect();
  }

  private startConfettiEffect() {
    // Start confetti raining for 3 seconds
    const duration = 2000;
    const end = Date.now() + duration;

    // Create a confetti animation that lasts for `duration` milliseconds
    const frame = () => {
      confetti({
        particleCount: 10,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: Math.random(), // Random horizontal position
          y: Math.random() - 0.2, // Slightly above the center
        },
      });

      // Stop the confetti effect after the duration is complete
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }
}
