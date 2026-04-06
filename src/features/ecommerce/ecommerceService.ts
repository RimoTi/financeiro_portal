import api from '../../services/api';
import axios from "axios";
import { csvEcommerceImport } from './types';

type ApiResponse = {
  message: string;
};

interface Resultado {
  transacaoId: number;
  numNf: number;
  status: string;
  mensagem: string;
}

export async function importarCsv(data: csvEcommerceImport[]): Promise<Resultado[]> {
  try {

    const response = await api.post<ApiResponse>(
      "/Conciliacao/BaixarDireto",
      data
    );

    return response.data as unknown as Resultado[];

  } catch (error: unknown) {

  if (axios.isAxiosError(error)) {
    return Promise.reject(
      error.response?.data?.message ||
      error.response?.data ||
      error.message
    );
  }

  if (error instanceof Error) {
    return Promise.reject(error.message);
  }

  return Promise.reject("Erro ao importar CSV");

  }
}