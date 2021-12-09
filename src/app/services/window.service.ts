import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  windowRef!: any;

  constructor() { }

  openWindow(url: string, name: string, options: string) {
    this.windowRef = window.open(url, name, options);
  }

  closeWindow(windowToClose: any) {
    this.windowRef = windowToClose;
    this.windowRef.close();
  }
}
