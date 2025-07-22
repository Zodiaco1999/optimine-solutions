export interface Message {
  type: 'received' | 'sent';
  text?: string;
  imageUrl?: string;
  tableData?: { part_number: string; name: string; quantity: number }[];
}
