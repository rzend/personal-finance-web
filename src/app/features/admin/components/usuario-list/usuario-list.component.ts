import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '@domain/models';

@Component({
    selector: 'app-usuario-list',
    templateUrl: './usuario-list.component.html',
    standalone: false
})
export class UsuarioListComponent implements OnInit {
    usuarios: Usuario[] = [];
    loading = false;
    selectedFile: File | null = null;
    message: string = '';
    error: string = '';

    constructor(private usuarioService: UsuarioService) { }

    ngOnInit(): void {
        this.carregarUsuarios();
    }

    carregarUsuarios(): void {
        this.loading = true;
        this.usuarioService.listarTodos().subscribe({
            next: (data) => {
                this.usuarios = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Erro ao listar usuários', err);
                this.error = 'Erro ao carregar lista de usuários.';
                this.loading = false;
            }
        });
    }

    excluirUsuario(id: number): void {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            this.usuarioService.excluir(id).subscribe({
                next: () => {
                    this.message = 'Usuário excluído com sucesso.';
                    this.carregarUsuarios();
                },
                error: (err) => {
                    console.error('Erro ao excluir', err);
                    this.error = 'Erro ao excluir usuário.';
                }
            });
        }
    }

    onFileSelected(event: any): void {
        this.selectedFile = event.target.files[0];
    }

    importarExcel(): void {
        if (!this.selectedFile) return;

        this.loading = true;
        this.usuarioService.importarExcel(this.selectedFile).subscribe({
            next: () => {
                this.message = 'Importação concluída com sucesso!';
                this.selectedFile = null;
                this.carregarUsuarios();
            },
            error: (err) => {
                console.error('Erro na importação', err);
                this.error = 'Falha na importação do arquivo.';
                this.loading = false;
            }
        });
    }
}
