import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [
    {
      id: 0,
      name: 'ABC',
      email: 'a@mail.ru',
      active: false,
    },
    {
      id: 1,
      name: 'DEF',
      email: 'b@mail.ru',
      active: true,
    },
    {
      id: 2,
      name: 'GHI',
      email: 'c@mail.ru',
      active: false,
    },
  ];

  private readonly users$ = of(this.users);

  getUsers() {
    return this.users$;
  }
}
