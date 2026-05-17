export interface IScanRepository {
  createSession(usuarioId: string): Promise<string>;
  uploadPhoto(sesionId: string, imageUri: string): Promise<void>;
  getSessionStatus(sesionId: string): Promise<string>;
}
