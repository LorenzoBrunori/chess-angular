import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showMenu: boolean = false;

  onReset(){
    this.showMenu = false;
    console.log("Reset was pressed");
  }

  onClose(){
    this.showMenu = false;
    console.log("Close was pressed");    
  }

  changeShowMenu(){
    this.showMenu = !this.showMenu;
  }
}
