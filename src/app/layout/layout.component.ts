import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@core/services';
import { ChatComponent } from '../shared/components/chat/chat.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ChatComponent],
  template: `
    <div class="layout">
      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="sidebar-header">
          <span class="logo">💰</span>
          <span class="logo-text" *ngIf="!sidebarCollapsed">FinApp</span>
        </div>

        <nav class="sidebar-nav">
          <a 
            routerLink="/dashboard" 
            routerLinkActive="active"
            class="nav-item"
            title="Dashboard"
          >
            <span class="nav-icon">📊</span>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Dashboard</span>
          </a>
          <a 
            routerLink="/transacoes" 
            routerLinkActive="active"
            class="nav-item"
            title="Transações"
          >
            <span class="nav-icon">💸</span>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Transações</span>
          </a>
          <a 
            routerLink="/analises" 
            routerLinkActive="active"
            class="nav-item"
            title="Análises"
          >
            <span class="nav-icon">📈</span>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Análises</span>
          </a>
          <a 
            routerLink="/cambio" 
            routerLinkActive="active"
            class="nav-item"
            title="Câmbio"
          >
            <span class="nav-icon">💱</span>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Câmbio</span>
          </a>
          <a 
            routerLink="/relatorios" 
            routerLinkActive="active"
            class="nav-item"
            title="Relatórios"
          >
            <span class="nav-icon">📄</span>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Relatórios</span>
          </a>
          <a 
            routerLink="/minha-familia" 
            routerLinkActive="active"
            class="nav-item"
            title="Minha Família"
          >
            <span class="nav-icon">👨‍👩‍👧‍👦</span>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Minha Família</span>
          </a>
          <a 
            *ngIf="isAdmin"
            routerLink="/admin/usuarios" 
            routerLinkActive="active"
            class="nav-item"
            title="Gestão de Usuários"
          >
            <span class="nav-icon">👥</span>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Usuários</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <button 
            class="nav-item logout-btn" 
            (click)="logout()"
            title="Sair"
          >
            <span class="nav-icon">🚪</span>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Sair</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content" [class.sidebar-collapsed]="sidebarCollapsed">
        <!-- Header -->
        <header class="header">
          <button class="toggle-sidebar" (click)="toggleSidebar()">
            ☰
          </button>
          <div class="header-right">
            <div class="user-info">
              <span class="user-name">{{ userName }}</span>
              <span class="user-avatar">👤</span>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Chat Component -->
      <app-chat></app-chat>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
      background: #f9fafb;
    }

    /* Sidebar */
    .sidebar {
      width: 260px;
      background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
      color: #ffffff;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 100;
      transition: width 0.3s ease;
    }

    .sidebar.collapsed {
      width: 72px;
    }

    .sidebar-header {
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo {
      font-size: 28px;
    }

    .logo-text {
      font-size: 20px;
      font-weight: 700;
      white-space: nowrap;
    }

    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 10px;
      color: #9ca3af;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
      font-size: 14px;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    .nav-item.active {
      background: rgba(79, 70, 229, 0.3);
      color: #ffffff;
    }

    .nav-icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    .nav-text {
      white-space: nowrap;
    }

    .sidebar-footer {
      padding: 16px 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logout-btn {
      color: #f87171 !important;
    }

    .logout-btn:hover {
      background: rgba(248, 113, 113, 0.2) !important;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      transition: margin-left 0.3s ease;
    }

    .main-content.sidebar-collapsed {
      margin-left: 72px;
    }

    /* Header */
    .header {
      height: 64px;
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .toggle-sidebar {
      background: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      color: #6b7280;
    }

    .toggle-sidebar:hover {
      background: #f3f4f6;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Page Content */
    .page-content {
      flex: 1;
      overflow-y: auto;
    }

    /* Mobile */
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }

      .sidebar.collapsed {
        transform: translateX(-100%);
      }

      .main-content {
        margin-left: 0;
      }

      .main-content.sidebar-collapsed {
        margin-left: 0;
      }
    }
  `]
})
export class LayoutComponent {
  sidebarCollapsed = false;
  userName = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.currentUser;
    this.userName = user?.nomeCompleto || 'Usuário';
  }

  get isAdmin(): boolean {
    return this.authService.hasRole('ROLE_MASTER');
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}
