export interface ScanOrder {
  id: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  imageUri: string | null;
  createdAt: Date;
}
