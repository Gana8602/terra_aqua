import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSource = new BehaviorSubject<string>('dark');
  currentTheme$ = this.themeSource.asObservable();

  constructor() { }

  changeTheme(theme: string) {
    this.themeSource.next(theme);
  }
}
