// Tipo usado na tela de login
export type UsuLogin = {
  login: string;
  senha: string;
};

// Tipo completo do usuário retornado da API
export interface Usuario {
  id: number;
  login: string;
  nome: string;
  email: string;
  telefone: string;
  ativo: number;
  token?: string; // se a API retornar um token JWT
  permissoes: string[];
};



