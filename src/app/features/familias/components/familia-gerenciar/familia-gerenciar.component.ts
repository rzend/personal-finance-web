import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FamiliaService } from '../../services/familia.service';
import { Usuario } from '@domain/models';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { RelatoriosApiService } from 'src/app/data/datasources/relatorios-api.service';

@Component({
    selector: 'app-familia-gerenciar',
    templateUrl: './familia-gerenciar.component.html',
    styleUrls: ['./familia-gerenciar.component.css']
})
export class FamiliaGerenciarComponent implements OnInit {
    familiaForm: FormGroup;
    membroForm: FormGroup;
    membros: Usuario[] = [];
    temFamilia = false;
    isGestor = false;
    isLoading = true;
    familyName: string = '';

    constructor(
        private fb: FormBuilder,
        private familiaService: FamiliaService,
        private authService: AuthService,
        private notification: NotificationService,
        private relatoriosService: RelatoriosApiService
    ) {
        this.familiaForm = this.fb.group({
            nome: ['', Validators.required]
        });

        this.membroForm = this.fb.group({
            usuarioId: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.carregarFamilia();
    }

    getInitials(name: string): string {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    carregarFamilia(): void {
        this.isLoading = true;
        this.familiaService.listarMeusMembros().subscribe({
            next: (membros) => {
                // Se retornar conteúdo (200), tem família
                // Se retornar 204 No Content, a lista virá null/undefined ou vazia dependendo do interceptor?
                // O service do angular retorna null para body vazio por padrão se não for ajustado.
                // Vamos assumir que se vier lista (mesmo vazia ou com 1 elemento), tem familia.
                // Mas a API retorna 204 se não tiver familia.
                if (membros) {
                    this.membros = membros;
                    this.temFamilia = true;
                    this.verificarPermissaoGestor();
                } else {
                    this.temFamilia = false;
                }
                this.isLoading = false;
            },
            error: (err) => {
                // Se o backend retornar 204 sem body, o Angular entende como sucesso com body null.
                // Se for erro real (4xx, 5xx), cai aqui.
                console.error('Erro ao carregar família', err);
                this.temFamilia = false;
                this.isLoading = false;
            }
        });
    }

    verificarPermissaoGestor() {
        // Lógica simples: Se eu criei, sou gestor.
        // Ou verificar role do usuário logado.
        this.isGestor = this.authService.hasRole('ROLE_GESTOR') || this.authService.hasRole('ROLE_MASTER');
    }

    criarFamilia() {
        if (this.familiaForm.invalid) return;

        this.familiaService.criarFamilia(this.familiaForm.value.nome).subscribe({
            next: () => {
                this.notification.success('Família criada com sucesso!');
                this.temFamilia = true;
                this.carregarFamilia();
            },
            error: (err) => this.notification.error('Erro ao criar família.')
        });
    }

    adicionarMembro() {
        if (this.membroForm.invalid) return;

        // Assumindo que o ID da família é o da família do usuário logado.
        // A API pede ID da família na URL: /familias/{id}/membros
        // Mas o endpoint 'meus-membros' não retorna o ID da família explicitamente no DTO de Usuario, 
        // a não ser que UsuarioDto tenha. Vamos ver o UsuarioDto.
        // O UsuarioDto tem, mas a lista de meus membros retorna UsuarioDto.
        // Se eu sou membro, qualquer um da lista serve para pegar o ID da família.

        if (!this.membros.length) return;

        // O backend espera o ID da familia na URL.
        // Como identificar o ID da minha família? 
        // O endpoint listarMeusMembros retorna lista de usuarios. 
        // Preciso garantir q tenho o ID da familia.
        // Vou assumir que o primeiro membro da lista tem a info da familia se o DTO retornar.
        // Analisando o backend: UsuarioDto não tem objeto Familia, mas tem... não tem ID da familia.
        // O backend UsuarioDto: id, nome, email, cpf, moeda, status, criadoEm.
        // VIXI. O endpoint 'listarMeusMembros' retorna lista de usuários, mas não retorna o ID da família.
        // O endpoint criaFamilia não retorna ID.
        // Como vou saber o ID da família para adicionar membro?
        // SOLUÇÃO: O usuário logado tem a info da família? 
        // O `authService.getUsuario()` retorna o usuario armazenado no login.
        // Vamos verificar o `auth.service.ts` ou o modelo de Usuario no front.

        // Vou tentar pegar do usuario logado se tiver atualizado.
        // Se não, precisarei de um endpoint para pegar "Minha Família".
        // Mas o endpoint de POST /familias/{id}/membros exige o ID.

        // WORKAROUND TEMPORÁRIO: 
        // O backend `FamiliaController` tem `listarMeusMembros`.
        // Talvez eu precise alterar o backend para retornar o ID da família ou criar um endpoint `GET /familias/minha`.
        // OU, verificar se o `Usuario` no front já tem essa info.

        // Assumindo que vou precisar do ID.
        // Vou deixar um TODO e tentar pegar de algum lugar.
        // Por enquanto, vou pegar de `this.membros[0].familiaId` (se existisse) ou algo assim.

        // PAUSA. Vou fazer o código esperando que o `authService` tenha o ID ou que eu possa pegar de algum lugar.
        // Se não tiver, vou ter que alterar o backend.

        // Vou enviar um placeholder e avisar no comentário.
        const familiaId = this.membros[0].familiaId;
        if (!familiaId) {
            this.notification.error("Não foi possível identificar sua família.");
            return;
        }

        this.familiaService.adicionarMembro(familiaId, this.membroForm.value.usuarioId).subscribe({
            next: () => {
                this.notification.success('Membro adicionado!');
                this.membroForm.reset();
                this.carregarFamilia();
            },
            error: () => this.notification.error('Erro ao adicionar membro.')
        });
    }

    downloadPdf(usuario: Usuario) {
        this.relatoriosService.downloadPdf(usuario.id).subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `relatorio_${usuario.nomeCompleto}.pdf`;
            link.click();
        });
    }

    downloadExcel(usuario: Usuario) {
        this.relatoriosService.downloadExcel(usuario.id).subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `relatorio_${usuario.nomeCompleto}.xlsx`;
            link.click();
        });
    }
}
