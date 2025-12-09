import { Component, OnChanges, OnInit, SimpleChanges, computed, input, numberAttribute, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button-paginator',
  imports: [MatButtonModule],
  templateUrl: './button-paginator.component.html',
  styleUrl: './button-paginator.component.scss',
})
export class ButtonPaginatorComponent implements OnInit, OnChanges {
  pageSize = input.required({ transform: numberAttribute });
  dataLength = input.required({ transform: numberAttribute });

  currentPage = signal(0);

  currentPageNumber = computed(() => (this.dataLength() > 0 ? this.currentPage() : 0));

  pageLength = computed(() => calculatePagesLength(this.dataLength(), this.pageSize()));
  hasNextPage = computed(() => this.pageLength() > this.currentPage());
  hasPreviousPage = computed(() => this.currentPage() >= this.pageLength());

  ngOnInit(): void {
    this.currentPage.set(1);
  }
  /**
   * react on parent component changing the appCustomLength - rerender bubbles
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.['dataLength']?.firstChange) {
      // remove buttons before creating new ones
      // this.removeButtons();
      // // switch back to page 0
      // this.switchPage(0);
      // this.renderButtons();
    }
  }

  reset(): void {
    this.currentPage.set(0);
  }
}

function calculatePagesLength(dataLength: number, pageSize: number): number {
  return Math.ceil(dataLength / pageSize);
}
