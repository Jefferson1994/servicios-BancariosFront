import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'servicios-BancariosFront';
}


//import { Component } from '@angular/core';

//@Component({
//  selector: 'app-root',
//  template: `<h1>Welcome to the app!</h1>`,
//  standalone: true
//})
//export class AppComponent {}
