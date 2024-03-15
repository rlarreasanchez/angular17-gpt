import { Injectable } from '@angular/core';
import { ortographyUseCase } from '@use-cases/ortography/ortography.use-case';
import { prosConsUseCase } from '@use-cases/prosCons/prosCons.use-case';
import { prosConsStreamUseCase } from '@use-cases/prosCons/prosConsStream.use-case';
import { translateUseCase } from '@use-cases/translate/translate.use-case';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpenAiService {
  checkOrtography(prompt: string) {
    return from(ortographyUseCase(prompt));
  }

  prosConsDiscusser(prompt: string) {
    return from(prosConsUseCase(prompt));
  }

  prosConsDiscusserStream(prompt: string, abortSignal: AbortSignal) {
    return prosConsStreamUseCase(prompt, abortSignal);
  }

  translate(prompt: string, lang: string) {
    return from(translateUseCase(prompt, lang));
  }
}
