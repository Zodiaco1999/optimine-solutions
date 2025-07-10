import { Routes } from '@angular/router';
import { ChatBot } from './pages/chat-bot/chat-bot';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  { path: 'chat', component: ChatBot, pathMatch: 'full' },
  { path: '**', component: NotFound, pathMatch: 'full' }
];
