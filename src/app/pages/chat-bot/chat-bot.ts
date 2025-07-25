import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot-service';
import { Message } from '../../models/message';
import { MarkdownModule } from 'ngx-markdown';


@Component({
  selector: 'app-chat-bot',
  imports: [CommonModule, ReactiveFormsModule, MarkdownModule
],
  templateUrl: './chat-bot.html',
  styleUrl: './chat-bot.css'
})
export class ChatBot {
  inputText = new FormControl('');
  messages: Message[] = [];
  currentImage: File | null = null;
  previewImageUrl?: string = undefined;
  previewAudioUrl: string | null = null;
  isRecording = false;
  isloading = false;

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];


  constructor(
    @Inject(ChangeDetectorRef) private cdr: ChangeDetectorRef,
    private chatbotService: ChatbotService
  ) {}

  onSubmit() {
    this.isloading = true;
    const text = this.inputText.value?.trim();
    this.resetChat();
    if (text && this.currentImage) {
      this.pushMessage(text, true, this.previewImageUrl);

      this.chatbotService.predictImage(this.currentImage as File).subscribe({
        next: (response) => {
          if (response.is_success) {
            const replacement = response.replacement!;
            this.pushMessage(
              `Repuesto encontrado: ${replacement.name}`,
              false,
              undefined,
              [{ part_number: replacement.part_number, name: replacement.name, quantity: replacement.quantity }]
            );
          }
          else {
            this.pushMessage('No se encontró un repuesto adecuado.');
            console.log('nivel de confianza desconocido:', response.confidence_score);
          }
        },
        error: (error) => {
          console.error('Error al enviar la imagen:', error);
          this.pushMessage('Error al procesar la imagen.');
        },
        complete: () => {
          this.resetImage();
          this.isloading = false;
        }
      });
    } else if (text) {
      this.pushMessage(text, true);
      this.chatbotService.sendMessage(text).subscribe({
        next: (response) => {
          this.pushMessage(response.response, false)
        },
        error: (error) => {
          console.error('Error al enviar el mensaje:', error);
          this.pushMessage('Error al enviar el mensaje.');
        },
        complete: () => {
          this.isloading = false;
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
      this.previewImageUrl = undefined;
    } else if (url === this.previewAudioUrl) {
      this.previewAudioUrl = null;
    }
    this.cdr.detectChanges();
  }

  pushMessage(
  text?: string,
  sent: boolean = false,
  imageUrl?: string,
  tableData?: { part_number: string; name: string; quantity: number }[]
) {
  this.messages.push({
    type: sent ? 'sent' : 'received',
    ...(text ? { text } : {}),
    ...(imageUrl ? { imageUrl } : {}),
    ...(tableData ? { tableData } : {})
  });
}

  resetChat() {
    this.inputText.setValue('');
    this.previewAudioUrl = null;
    this.cdr.detectChanges();
  }

  resetImage() {
    this.previewImageUrl = undefined;
    this.currentImage = null;
    this.cdr.detectChanges();
  }


}
