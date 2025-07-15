import { Routes } from '@angular/router';
import { ChatBot } from './pages/chat-bot/chat-bot';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  { path: 'chat', loadComponent: () => import('./pages/chat-bot/chat-bot').then(m => m.ChatBot) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound) }
];
