import { environment } from '@env/environment';
import { OrtographyResponse } from '@interfaces/ortography.interface';

export const ortographyUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(`${environment.backendApi}/ortography-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!resp.ok) throw new Error('Error en la petición');

    const data = (await resp.json()) as OrtographyResponse;
    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      userScore: 0,
      errors: [],
      message: 'No se pudo realizar la corrección',
    };
  }
};
