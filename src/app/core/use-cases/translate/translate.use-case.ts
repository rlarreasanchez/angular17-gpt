import { environment } from '@env/environment';
import { TranslateResponse } from '@interfaces/translate.interface';

export const translateUseCase = async (prompt: string, lang: string) => {
  try {
    const resp = await fetch(`${environment.backendApi}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, lang }),
    });

    if (!resp.ok) throw new Error('Error en la petición');

    const { message } = (await resp.json()) as TranslateResponse;
    return {
      ok: true,
      message,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo realizar la traducción',
    };
  }
};
