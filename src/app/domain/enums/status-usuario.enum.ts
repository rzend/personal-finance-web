export enum StatusUsuario {
    ATIVO = 'ATIVO',
    INATIVO = 'INATIVO',
    BLOQUEADO = 'BLOQUEADO'
}

export const StatusUsuarioLabels: Record<StatusUsuario, string> = {
    [StatusUsuario.ATIVO]: 'Ativo',
    [StatusUsuario.INATIVO]: 'Inativo',
    [StatusUsuario.BLOQUEADO]: 'Bloqueado'
};

export const StatusUsuarioColors: Record<StatusUsuario, string> = {
    [StatusUsuario.ATIVO]: '#10B981',
    [StatusUsuario.INATIVO]: '#F59E0B',
    [StatusUsuario.BLOQUEADO]: '#EF4444'
};
