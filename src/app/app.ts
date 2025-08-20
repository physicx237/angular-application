import { Component } from '@angular/core';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserInfoComponent } from './components/user-info/user-info.component';

@Component({
  selector: 'app-root',
  imports: [UserListComponent, UserInfoComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  email!: string | null;
}
