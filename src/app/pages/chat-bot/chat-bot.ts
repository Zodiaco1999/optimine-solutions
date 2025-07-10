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
  previewImageUrl: string | null = null;
  previewAudioUrl: string | null = null;
  isRecording = false;

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor(private cdr: ChangeDetectorRef, private chatbotService: ChatbotService) {}

  onSubmit() {
    const text = this.inputText.value?.trim();
    if (text) {
      this.messages.push({ type: 'sent', text });
      this.chatbotService.sendMessage(text).subscribe(response => {
        this.messages.push({ type: 'received', text: response });
      });

      this.inputText.setValue('');
      this.previewImageUrl = null;
      this.previewAudioUrl = null;
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.previewImageUrl = URL.createObjectURL(file);
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

}
