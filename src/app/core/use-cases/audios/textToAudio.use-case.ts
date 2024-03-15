import { environment } from '@env/environment';
import { OrtographyResponse } from '@interfaces/ortography.interface';

export const textToAudioUseCase = async (prompt: string, voice: string) => {
  try {
    const resp = await fetch(`${environment.backendApi}/text-to-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, voice }),
    });

    if (!resp.ok) throw new Error('Error en la petición');

    const audioFile = await resp.blob();
    const audioUrl = URL.createObjectURL(audioFile);
    return {
      ok: true,
      message: prompt,
      audioUrl,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo general el audio',
      audioUrl: '',
    };
  }
};
