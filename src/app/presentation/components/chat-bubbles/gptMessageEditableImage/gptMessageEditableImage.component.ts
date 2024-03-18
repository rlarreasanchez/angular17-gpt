import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-gpt-message-editable-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gptMessageEditableImage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GptMessageEditableImageComponent implements AfterViewInit {
  @Input({ required: true }) public text!: string;
  @Input({ required: true }) public imageInfo!: { url: string; alt: string };
  @ViewChild('canvas') public canvasElement!: ElementRef<HTMLCanvasElement>;

  @Output() public onSelectedImage = new EventEmitter<string>();

  public originalImage = signal<HTMLImageElement | null>(null);
  public isDrawing = signal<boolean>(false);
  public coords = signal({ x: 0, y: 0 });

  ngAfterViewInit(): void {
    if (!this.canvasElement?.nativeElement) return;

    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    if (!context) return;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = this.imageInfo.url;

    this.originalImage.set(image);

    image.onload = () => {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  }

  onMouseDown(event: MouseEvent): void {
    if (!this.canvasElement?.nativeElement) return;

    this.isDrawing.set(true);
    const startX =
      event.clientX -
      this.canvasElement.nativeElement.getBoundingClientRect().left;
    const startY =
      event.clientY -
      this.canvasElement.nativeElement.getBoundingClientRect().top;
    this.coords.set({ x: startX, y: startY });
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDrawing()) return;
    if (!this.canvasElement?.nativeElement) return;

    const canvas = this.canvasElement.nativeElement;
    const currentX = event.clientX - canvas.getBoundingClientRect().left;
    const currentY = event.clientY - canvas.getBoundingClientRect().top;

    // Calcular el ancho y alto de un rectángulo
    const width = currentX - this.coords().x;
    const height = currentY - this.coords().y;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const context = canvas.getContext('2d');
    context?.clearRect(0, 0, canvasWidth, canvasHeight);
    context?.drawImage(this.originalImage()!, 0, 0, canvasWidth, canvasHeight);

    // context?.fillRect(this.coords().x, this.coords().y, width, height);
    context?.clearRect(this.coords().x, this.coords().y, width, height);
  }

  onMouseUp(): void {
    this.isDrawing.set(false);
    const canvas = this.canvasElement.nativeElement;
    const url = canvas.toDataURL('image/png');

    this.onSelectedImage.emit(url);
  }

  handleClick(): void {
    this.onSelectedImage.emit(this.imageInfo.url);
  }
}
