import api from '../../services/api';
import { Representante } from './types';

export async function getCuponsPedidosNaoGerados(): Promise<Representante[]> {
    const response = await api.get<Representante[]>(
      "/Cupon/BuscarDadosParaGerarCupons",
    );
    return response.data as unknown as Representante[];
}

export async function gerarTituloCupom(reps:Representante[]): Promise<string> {

    const response = await api.post<string>(
      "/Cupon/GerarCupons",
      reps
    );
    return response.data as unknown as string;

}

