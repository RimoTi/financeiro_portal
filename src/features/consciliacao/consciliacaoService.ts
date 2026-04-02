import api from '../../services/api';
import axios from "axios";
import { Conciliacao, CsvSisPag, NotaFiscal, Transacao } from './types';
import { validarCsv as validarCsvType, importarCsv as csvImport, ApiResquestGetNota } from './types';

type ApiResponse = {
  message: string;
};

// 🔥 função 1
export async function validarCsv(data: validarCsvType): Promise<string> {
  try {

    const response = await api.post<ApiResponse>(
      "/CsvSistPag/Validar",
      data
    );

    return response.data.message || "Validação realizada com sucesso!";
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

// 🔥 função 3
export async function importarCsv(data: csvImport[]): Promise<string> {
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

// 🔥 função 2
export async function getAllSisPag(): Promise<CsvSisPag[]> {
  try {
    const response = await api.get<CsvSisPag[]>(
      "CsvSistPag/BuscarTodos"
    );

    return response.data || [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Erro ao buscar dados");
    }
    throw new Error("Erro ao buscar dados");
  }

}


const toNumber = (value: string): number => {
  if (!value) return 0;

  return Number(
    value
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim()
  );
};

const toDate = (value: string): string => {
  if (!value) return "";

  // "02/02/2026 13:48"
  const [datePart, timePart] = value.split(" ");
  const [day, month, year] = datePart.split("/");

  const iso = `${year}-${month}-${day}${timePart ? `T${timePart}:00` : "T00:00:00"}`;

  return new Date(iso).toISOString();
};

export const mapCsvToDto = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[],
  sistPagId: number
): csvImport[] => {

  return data
    .filter(item => item["Número da autorização"] && item["Número da autorização"].trim() !== "")
    .map((item) => ({
      numEstabelecimento: item["Nº do estabelecimento"],
      dataTransacao: toDate(item["Data da transação"]),
      numTransacao: item["Nº da transação"],
      idVenda: item["ID Venda"],
      bandeira: item["Bandeira"],
      formaPagamento: item["Forma de Pagamento"],
      planoVenda: item["Plano de venda"],
      parcela: Number(item["Parcela"]),
      totalParcela: Number(item["Total de parcela"]),
      numAutorizacao: item["Número da autorização"],
      tipoCartao: item["Tipo cartão"],
      numCartao: item["Número do cartão"],
      numTerminal: item["Número do terminal"],
      tipoCaptura: item["Tipo captura"],
      indCreditoDebito: item["Indicador Crédito/Débito"],
      indCancelamentoVenda: item["Indicador de cancelamento da venda"],
      numResumoVenda: item["Nº resumo da venda"],
      dataPrevistaLiquidacao: toDate(item["Data prevista de liquidação"]),
      seuNumero: item["Seu número"],
      numOrdemPagamento: item["Nº ordem de pagamento"],
      status: item["Status"],
      dataPagamento: toDate(item["Data do pagamento"]),
      numBanco: item["Nº do banco"],
      numAgencia: item["Nº da agência"],
      numConta: item["Nº da conta"],
      valorParcelaBruto: toNumber(item["Valor parcela bruto"]),
      descontoParcela: toNumber(item["Desconto parcela"]),
      valorParcelaLiquido: toNumber(item["Valor parcela liquido"]),
      totalPlanoVenda: toNumber(item["Total plano de venda"]),
      sistPagId
    }));
};

export async function baixarTitulosPendente(data: Transacao[]): Promise<string> {
  try {
    const response = await api.post<ApiResponse>(
      "/Conciliacao/BaixarTitulos",
      data
    );
    return response.data.message || "titulos baixados com sucesso!";
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiResponse>(error)) {
      console.log(error.response?.data?.message || "Erro ao buscar sistema de pagamento");
    }
    throw new Error("Erro ao buscar sistema de pagamento");

  }
}

export async function getTransacoesSemVinculo(): Promise<Conciliacao[]> {
  try {
    const response = await api.get<Conciliacao[]>(
      "/Conciliacao/SemVinculo"
    );
    return response.data || [];
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiResponse>(error)) {
      console.log(error.response?.data?.message || "Erro ao exportar CSV");
    }
    throw new Error("buscar conciliação sem vínculo");
  }
}
export async function getTransacoesPendentesBaixa(): Promise<Transacao[]> {
  try {
    const response = await api.get<Transacao[]>(
      "/Conciliacao/MovimentosPendentesBaixa"
    );
    return response.data || [];
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiResponse>(error)) {
      console.log(error.response?.data?.message || "Erro ao exportar CSV");
    }
    throw new Error("buscar conciliação sem vínculo");
  }
}

export async function getNota(data: ApiResquestGetNota): Promise<NotaFiscal> {
  try {
    const response = await api.get<NotaFiscal>(
      `/Conciliacao/BuscarNota?numNf=${data.numNf}&chaveAcesso=${data.chaveAcesso}`
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiResponse>(error)) {
      console.log(error.response?.data?.message || "Erro ao buscar nota");
    }
    throw new Error("Erro ao buscar nota");
  }
}

export async function vincularNota(concil: Conciliacao): Promise<string> {
  try {
    const concliacaoLista: Conciliacao[] = [concil];
    const response = await api.post<string>(
      `/Conciliacao/VincularTitulos`, concliacaoLista
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiResponse>(error)) {
      console.log(error.response?.data?.message || "Erro ao vincular nota");
    }
    throw new Error("Erro ao vincular nota");
  }
}

