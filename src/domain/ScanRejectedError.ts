export class ScanRejectedError extends Error {
  constructor(message = 'La foto no pudo ser procesada') {
    super(message);
    this.name = 'ScanRejectedError';
  }
}
