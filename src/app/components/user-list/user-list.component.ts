import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { ACTIVE_SELECT_CONFIG } from '../../configs/active-select.config';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  previousSelectedUserId: number | null = null;
  currentSelectedUserId: number | null = null;

  private readonly userService = inject(UserService);
  private readonly nameFilterValue$ = new BehaviorSubject('');
  private readonly activeFilterValue$ = new BehaviorSubject<boolean | null>(
    null
  );
  readonly selectOptions = ACTIVE_SELECT_CONFIG.selectOptions;

  @Output() onSelectUser = new EventEmitter<string | null>();

  getUsers() {
    return combineLatest({
      users: this.userService.getUsers(),
      nameFilterValue: this.nameFilterValue$,
      activeFilterValue: this.activeFilterValue$,
    }).pipe(
      map(({ users, nameFilterValue, activeFilterValue }) =>
        this.filterUsers(users, nameFilterValue, activeFilterValue)
      )
    );
  }

  filterUsers(
    users: User[],
    nameFilterValue: string,
    activeFilterValue: boolean | null
  ) {
    return users.filter(
      (item) =>
        item.name.startsWith(nameFilterValue) &&
        (activeFilterValue === item.active || activeFilterValue === null)
    );
  }

  onInput(event: Event) {
    this.nameFilterValue$.next((event.target as HTMLInputElement).value);
  }

  onChange(event: Event) {
    let value = null;

    const eventTargetValue = (event.target as HTMLSelectElement).value;

    switch (eventTargetValue) {
      case 'active':
        value = true;
        break;
      case 'inactive':
        value = false;
        break;
      default:
        break;
    }

    this.activeFilterValue$.next(value);
  }

  selectUser({ id, email }: User) {
    switch (this.previousSelectedUserId) {
      case null:
        this.previousSelectedUserId = id;
        this.currentSelectedUserId = id;
        this.onSelectUser.emit(email);
        return;
      case id:
        this.onSelectUser.emit(null);
        this.previousSelectedUserId = null;
        return;
      default:
        this.onSelectUser.emit(email);
        this.currentSelectedUserId = id;
        break;
    }
  }
}
