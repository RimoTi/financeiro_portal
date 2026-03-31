import api from '../../services/api';
import axios from "axios";

export type Coluna = {
  nomeColunaCsv: string;
  posicaoColuna: number;
};

export type ValidarCsvRequest = {
  sistPagId: number;
  colunas: Coluna[];
};

type ApiResponse = {
  message: string;
};

export const consciliacaoService = {
  async importarCSV(data: ValidarCsvRequest): Promise<string | void> {
    try {
        console.log("Enviando dados para API:", data); // Log para verificar o payload
      const response = await api.post<ApiResponse>(
        "/CsvSistPag/Validar",
        data
      );

      return response?.data?.message || "Validação realizada com sucesso! (fixo)";
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "Erro ao importar CSV";
  } else {
        return "Erro ao importar CSV";
      }
    }
  },
};