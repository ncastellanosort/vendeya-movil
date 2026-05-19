export class ScanRejectedError extends Error {
  tipo: string;

  constructor(tipo: string, mensaje: string) {
    super(mensaje);
    this.name = 'ScanRejectedError';
    this.tipo = tipo;
  }
}
