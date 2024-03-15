import { environment } from '@env/environment';

export async function* prosConsStreamUseCase(
  prompt: string,
  abortSignal: AbortSignal,
) {
  try {
    const resp = await fetch(
      `${environment.backendApi}/pros-cons-discusser-stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        signal: abortSignal,
      },
    );

    if (!resp.ok) throw new Error('Error en la petición');

    const reader = resp.body?.getReader();
    if (!reader) throw new Error('Error al leer el stream');

    const decoder = new TextDecoder();
    let text = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const decodedChunk = decoder.decode(value, { stream: true });
      text += decodedChunk;
      yield text;
    }

    return text;
  } catch (error) {
    return null;
  }
}
