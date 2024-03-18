import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ChatMessageComponent } from '@components/chat-bubbles/chatMessage/chatMessage.component';
import { GptMessageEditableImageComponent } from '@components/chat-bubbles/gptMessageEditableImage/gptMessageEditableImage.component';
import { MyMessageComponent } from '@components/chat-bubbles/myMessage/myMessage.component';
import { TextMessageBoxComponent } from '@components/text-boxes/textMessageBox/textMessageBox.component';
import { TypingLoaderComponent } from '@components/typingLoader/typingLoader.component';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-image-tunning-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    GptMessageEditableImageComponent,
  ],
  templateUrl: './imageTunningPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageTunningPageComponent {
  public messages = signal<Message[]>([
    {
      isGpt: true,
      text: 'A character from Dragon Ball Z',
      imageInfo: {
        alt: 'A character from Dragon Ball Z',
        url: 'http://localhost:3000/gpt/image-generation/1710746717585.png',
      },
    },
  ]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);

  public originalImage = signal<string | undefined>(undefined);
  public maskImage = signal<string | undefined>(undefined);

  handleMessage(message: string): void {
    this.isLoading.set(true);
    this.messages.update((prev) => [...prev, { text: message, isGpt: false }]);

    this.openAiService
      .imageGeneration(message, this.originalImage(), this.maskImage())
      .subscribe((resp) => {
        this.isLoading.set(false);

        if (!resp) return;

        this.messages.update((prev) => [
          ...prev,
          {
            text: resp.alt,
            isGpt: true,
            imageInfo: resp,
          },
        ]);
      });
  }

  handleImageClick(newImage: string, originalImage: string): void {
    this.originalImage.set(originalImage);
    this.maskImage.set(newImage);
  }

  generateVariation(): void {
    this.isLoading.set(true);
    this.openAiService
      .imageVariation(this.originalImage()!)
      .subscribe((resp) => {
        this.isLoading.set(false);

        if (!resp) return;

        this.messages.update((prev) => [
          ...prev,
          {
            text: resp.alt,
            isGpt: true,
            imageInfo: resp,
          },
        ]);
      });
  }
}
