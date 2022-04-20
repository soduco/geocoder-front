import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Géocodeur historique';
  public innerWidth:any = window.innerWidth;

  @HostListener('window:resize', ['$event']) onResize() { 
    this.innerWidth = window.innerWidth; 
    
  }

  reload(){
    window.location.reload();
  }
 
  
}

