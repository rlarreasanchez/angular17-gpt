import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ChatMessageComponent } from '@components/chat-bubbles/chatMessage/chatMessage.component';
import { MyMessageComponent } from '@components/chat-bubbles/myMessage/myMessage.component';
import { TextMessageBoxComponent } from '@components/text-boxes/textMessageBox/textMessageBox.component';
import {
  TextMessageBoxFileComponent,
  TextMessageEvent,
} from '@components/text-boxes/textMessageBoxFile/textMessageBoxFile.component';
import {
  TextMessageBoxEvent,
  TextMessageBoxSelectComponent,
} from '@components/text-boxes/textMessageBoxSelect/textMessageBoxSelect.component';
import { TypingLoaderComponent } from '@components/typingLoader/typingLoader.component';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-ortography-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    TextMessageBoxFileComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './ortographyPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrtographyPageComponent {
  public messages = signal<Message[]>([{ text: 'Hola mundo', isGpt: false }]);
  public isLoading = signal<boolean>(false);
  public openAiService = inject(OpenAiService);

  handleMessage(message: string): void {
    console.log({ message });
  }

  handleMessageFile({ prompt, file }: TextMessageEvent): void {
    console.log({ prompt, file });
  }

  handleMessageSelect({ prompt, selectedOption }: TextMessageBoxEvent): void {
    console.log({ prompt, selectedOption });
  }
}
