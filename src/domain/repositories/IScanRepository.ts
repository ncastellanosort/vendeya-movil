export interface IScanRepository {
  uploadPhoto(orderId: string, imageUri: string): Promise<void>;
}
