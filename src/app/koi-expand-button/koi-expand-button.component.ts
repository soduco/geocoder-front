import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'koi-expand-button',
  templateUrl: './koi-expand-button.component.html',
  styleUrls: ['./koi-expand-button.component.css']
})
export class KoiExpandIconComponent {
  @Input()
  public expanded: boolean = true;

  @Output()
  public expandedChange: EventEmitter<boolean> = new EventEmitter();

  public toggle() {
    this.expanded = !this.expanded;
    this.expandedChange.next(this.expanded);
  }
}

