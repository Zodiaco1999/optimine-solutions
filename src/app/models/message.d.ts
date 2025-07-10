export interface Message {
  type: 'received' | 'sent';
  text: string;
  imageUrl?: string;
}
