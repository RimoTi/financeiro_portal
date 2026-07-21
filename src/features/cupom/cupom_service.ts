import api from '../../services/api';
import { Abatimento, DadosGerarCupon, DetalhesSaldo, SaldoRepresentante, MovimentoBaixa, TitulosPendentesErp, Cupom, payloadPesquisa, BaixasIndevidas, filterExtrato, Extrato } from './types';

export async function getCuponsPedidosNaoGerados(): Promise<DadosGerarCupon[]> {
    const response = await api.get<DadosGerarCupon[]>(
      "/Cupon/BuscarDadosParaGerarCupons",
    );
    return response.data as unknown as DadosGerarCupon[];
}

export async function gerarTituloCupom(reps:DadosGerarCupon[]): Promise<string> {
    const response = await api.post<string>(
      "/Cupon/GerarCupons",
      reps
    );
    return response.data as unknown as string;
}

export async function getAbatimentos(pedidos: number[]): Promise<Abatimento[]> {
  const response = await api.post<Abatimento[]>(
      "/Cupon/ObterPedidosParaAbatimento",
      pedidos
    );
    return response.data as unknown as Abatimento[];
}

export async function getListaRepresentantes(): Promise<SaldoRepresentante[]> {
  const response = await api.get<SaldoRepresentante[]>(
      "/Cupon/SaldosPorRepresentante"
    );
    return response.data as unknown as SaldoRepresentante[];
}

export async function getDetalhesSaldo(codRep:string): Promise<DetalhesSaldo> {
  const response = await api.get<DetalhesSaldo>(
      `/Cupon/ObterCuponsPorRepresentante?codigoRepr=${codRep}`
    );
    return response.data as unknown as DetalhesSaldo;
}

export async function getDetalhesCupom(cupId:string): Promise<Cupom> {
  const response = await api.get<Cupom>(
      `/Cupon/${cupId}/detalhes`
    );
    return response.data as unknown as Cupom;
}

export async function getTotalCuponsGerar(): Promise<number> {
  const response = await api.get<number>(
      `/Cupon/ContagemRepresentantesComSaldo`
    );
    return response.data as unknown as number;
}

export async function getCuponsPendentesBaixarNoErp(): Promise<TitulosPendentesErp[]> {
  const response = await api.get<TitulosPendentesErp[]>(
      `/Cupon/PendentesERP`
    );
    return response.data as unknown as TitulosPendentesErp[];
}

export async function deleteAbatimento(abatId:number): Promise<string> {
  const response = await api.delete<string>(
      `/Cupon/ExcluirAbatimento/${abatId}`
    );
    return response.data as unknown as string;
}

export async function baixarCupons(data: MovimentoBaixa): Promise<string> {
  const response = await api.post<string>(
      "/Cupon/RegistrarBaixas",
      data
    );
    return response.data as unknown as string;
}

export async function baixarTitulosErp(data: TitulosPendentesErp[]): Promise<string> {
  const response = await api.post<string>(
      "/Cupon/SincronizarERP",
      data
    );
    return response.data as unknown as string;
}

export async function pesquisarCupons(data: payloadPesquisa): Promise<DetalhesSaldo[]> {
  const response = await api.post<DetalhesSaldo[]>(
      "/Cupon/PesquisarCupons",
      data
    );
    return response.data as unknown as DetalhesSaldo[];
}

export async function getBaixasIndevidas(): Promise<BaixasIndevidas[]> {
  const response = await api.get<BaixasIndevidas[]>(
      "/Cupon/BaixasNaoReconhecidas"
    );
    return response.data as unknown as BaixasIndevidas[];
}

export async function getExtrato(data: filterExtrato): Promise<Extrato> {
  // 1. Formata as datas para o padrão DD/MM/YYYY
  // Certifique-se de que sua função formatDate retorna exatamente nesse formato
  const formatForApi = (date: Date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  // 2. Constrói os parâmetros da URL
  const params = new URLSearchParams({
    dtInicio: formatForApi(data.dataIni),
    dtFim: formatForApi(data.dataFim),
    codRep: String(data.codRep)
  });

  // 3. Faz a chamada usando os parâmetros
  const response = await api.get<Extrato>(`Cupon/Extrato?${params.toString()}`);
  
  return response.data;
  
}

