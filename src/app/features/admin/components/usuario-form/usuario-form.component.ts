import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '@domain/models';

@Component({
    selector: 'app-usuario-form',
    templateUrl: './usuario-form.component.html',
    standalone: false
})
export class UsuarioFormComponent implements OnInit {
    form: FormGroup;
    loading = false;
    usuarioId: number = 0;
    error = '';

    constructor(
        private fb: FormBuilder,
        private usuarioService: UsuarioService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.form = this.fb.group({
            nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
            // email: [{value: '', disabled: true}], // Email usually not editable or handled differently
            moedaPadrao: ['BRL', Validators.required]
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.usuarioId = +id;
            this.carregarUsuario(this.usuarioId);
        } else {
            // Edit mode only for now as per requirements
            this.router.navigate(['/admin/usuarios']);
        }
    }

    carregarUsuario(id: number): void {
        this.loading = true;
        this.usuarioService.buscarPorId(id).subscribe({
            next: (usuario) => {
                this.form.patchValue({
                    nomeCompleto: usuario.nomeCompleto,
                    moedaPadrao: usuario.moedaPadrao
                });
                this.loading = false;
            },
            error: (err) => {
                console.error('Erro ao carregar usuário', err);
                this.error = 'Erro ao carregar dados do usuário.';
                this.loading = false;
            }
        });
    }

    salvar(): void {
        if (this.form.invalid) return;

        this.loading = true;
        const dados = this.form.value;

        this.usuarioService.atualizar(this.usuarioId, dados).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(['/admin/usuarios']);
            },
            error: (err) => {
                console.error('Erro ao salvar', err);
                this.error = 'Erro ao salvar alterações.';
                this.loading = false;
            }
        });
    }
}
