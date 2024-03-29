import { Injectable } from '@angular/core';

import { from } from 'rxjs';

import { textToAudioUseCase } from '@use-cases/audios/textToAudio.use-case';
import { ortographyUseCase } from '@use-cases/ortography/ortography.use-case';
import { prosConsUseCase } from '@use-cases/prosCons/prosCons.use-case';
import { prosConsStreamUseCase } from '@use-cases/prosCons/prosConsStream.use-case';
import { translateUseCase } from '@use-cases/translate/translate.use-case';
import { audioToTextUseCase } from '@use-cases/audios/audioToText.use-case';
import { imageGenerationUseCase } from '@use-cases/image-generation/imageGeneration.use-case';
import { imageVariationUseCase } from '@use-cases/image-generation/imageVariation.use-case';

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

  textToAudio(prompt: string, voice: string) {
    return from(textToAudioUseCase(prompt, voice));
  }

  audioToText(file: File, prompt?: string) {
    return from(audioToTextUseCase(file, prompt));
  }

  imageGeneration(prompt: string, originalImage?: string, maskImage?: string) {
    return from(imageGenerationUseCase(prompt, originalImage, maskImage));
  }

  imageVariation(originalImage: string) {
    return from(imageVariationUseCase(originalImage));
  }
}
