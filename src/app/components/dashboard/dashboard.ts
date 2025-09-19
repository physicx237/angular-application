import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MATERIAL_MODULES } from '../../app.config';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [...MATERIAL_MODULES],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  navigateToEventsTimeline() {
    this.router.navigate(['../timeline'], { relativeTo: this.activatedRoute });
  }
}
