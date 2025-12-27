import { StatusUsuario } from '../enums';

export interface Usuario {
    id: number;
    nomeCompleto: string;
    email: string;
    cpf: string;
    moedaPadrao: string;
    status: StatusUsuario;
    criadoEm: string;
    familiaId?: number;
}

export interface UsuarioCriacao {
    nomeCompleto: string;
    email: string;
    cpf: string;
    senha: string;
    moedaPadrao?: string;
}

export interface UsuarioAtualizacao {
    nomeCompleto?: string;
    moedaPadrao?: string;
}

export interface LoginRequest {
    email: string;
    senha: string;
}

export interface LoginResponse {
    token: string;
    tipo: string;
    usuarioId: number;
    email: string;
    nomeCompleto: string;
}

export interface AuthUser {
    id: number;
    email: string;
    nomeCompleto: string;
    moedaPadrao?: string;
    roles?: string[];
}
