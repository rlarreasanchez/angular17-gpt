import { environment } from '@env/environment';
import { OrtographyResponse } from '@interfaces/ortography.interface';
import { ProsConstResponse } from '@interfaces/pros-const-response.interface';

export const prosConsUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(`${environment.backendApi}/pros-cons-discusser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!resp.ok) throw new Error('Error en la petición');

    const data = (await resp.json()) as ProsConstResponse;
    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      role: '',
      content: 'No se pudo realizar la comparación',
    };
  }
};
