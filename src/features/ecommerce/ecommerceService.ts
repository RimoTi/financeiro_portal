import api from '../../services/api';
import axios from "axios";
import { csvEcommerceImport } from './types';

type ApiResponse = {
  message: string;
};

export async function importarCsv(data: csvEcommerceImport[]): Promise<string> {
  try {

    const response = await api.post<ApiResponse>(
      "/Conciliacao/ImportarCsv",
      data
    );

    return response.data.message || "Importação realizada com sucesso!";
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