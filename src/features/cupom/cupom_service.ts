import api from '../../services/api';
import { Abatimento, DadosGerarCupon, DetalhesSaldo, SaldoRepresentante, MovimentoBaixa, TitulosPendentesErp } from './types';

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

