import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-info',
  imports: [],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoComponent {
  @Input() email!: string | null;
}
