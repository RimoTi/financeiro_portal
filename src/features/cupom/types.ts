export interface Credito {
  id: number;
  pdvId: number;
  dtCadastro: string;
  vlrPdv: number;
  vlrPremioPdv: number;
  vlrIpiSer: number;
  vlrBaseSer: number;
  vlrPremSer: number;
  vlrIpiMod: number;
  vlrBaseMod: number;
  vlrPremMod: number;
  dtPdv: string;
  numPdvLoja: number;
  repId: number;
  status: string;
  checkado: boolean;
  titCupId: number | null;
}

export interface Debito {
  id: number;
  pdvId: number;
  dtCadastro: string;
  vlrPdv: number;
  vlrPremioPdv: number;
  vlrIpiSer: number;
  vlrBaseSer: number;
  vlrPremSer: number;
  vlrIpiMod: number;
  vlrBaseMod: number;
  vlrPremMod: number;
  dtPdv: string;
  numPdvLoja: number;
  repId: number;
  tipoDeb: string;
  vlrDesc: number;
  vlrPend: number;
  status: string;
  checkado: boolean;
  titCupId: number | null;
}

export interface Representante {
  repId: number;
  codRep: string;
  descRep: string;
  creditos: Credito[];
  debitos: Debito[];
  cupon: Cupom;
}


export interface Cupom {
    repId: number;
    ttitCrId: number | null;
    vlrTit: number;
    vlrPendente: number;
    observacao: string;
    dtCadastro: Date;

}