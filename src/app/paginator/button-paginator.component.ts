import { AfterViewInit, Component, OnChanges, SimpleChanges, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button-paginator',
  imports: [MatButtonModule],
  templateUrl: './button-paginator.component.html',
  styleUrl: './button-paginator.component.scss',
})
export class ButtonPaginatorComponent implements AfterViewInit, OnChanges {
  appCustomLength = input.required<number>();

  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  /**
   * react on parent component changing the appCustomLength - rerender bubbles
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.['appCustomLength']?.firstChange) {
      // remove buttons before creating new ones
      this.removeButtons();
      // switch back to page 0
      this.switchPage(0);
      this.renderButtons();
    }
  }
}
