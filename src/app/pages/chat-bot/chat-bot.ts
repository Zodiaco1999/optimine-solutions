import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot-service';
import { Message } from '../../models/message';

@Component({
  selector: 'app-chat-bot',
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: './chat-bot.html',
  styleUrl: './chat-bot.css'
})
export class ChatBot {
  inputText = new FormControl('');
  messages: Message[] = [];
  currentImage: File | null = null;
  previewImageUrl: string | null = null;
  previewAudioUrl: string | null = null;
  isRecording = false;

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor(private cdr: ChangeDetectorRef, private chatbotService: ChatbotService) {}

  onSubmit() {
    const text = this.inputText.value?.trim();
    if (text) {
      this.pushMessage(text);

      this.chatbotService.predictImage(this.currentImage as File).subscribe({
        next: (response) => {
          this.pushMessage(`Predicción: ${response.class} con confianza el ${response.confidence}`, false);
          this.resetChat();
        },
        error: (error) => {
          console.error('Error al enviar la imagen:', error);
          this.pushMessage('Error al procesar la imagen.');
        }
      });
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.previewImageUrl = URL.createObjectURL(file);
      this.currentImage = file;
    }
  }

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      console.log('Grabación iniciada');
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.previewAudioUrl = URL.createObjectURL(audioBlob);
        this.cdr.detectChanges();
        stream.getTracks().forEach(track => track.stop());
      };
      this.mediaRecorder.start();
      this.isRecording = true;
    }).catch(err => {
      alert('No se pudo acceder al micrófono.');
      this.isRecording = false;
    });
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  closePreview(url: string | null) {
    if (url === this.previewImageUrl) {
      this.previewImageUrl = null;
    } else if (url === this.previewAudioUrl) {
      this.previewAudioUrl = null;
    }
    this.cdr.detectChanges();
  }

  pushMessage(message: string, isSent: boolean = true) {
    const msg: Message = { text: message, type: isSent ? 'sent' : 'received' };
    this.messages.push(msg);
  }

  resetChat() {
    this.inputText.setValue('');
    this.previewImageUrl = null;
    this.previewAudioUrl = null;
    this.currentImage = null;
  }

}
