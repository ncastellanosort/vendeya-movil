import apiClient from '../../core/http/ApiClient';
import type { LoginResponseDto } from '../dtos/LoginResponseDto';

export class AuthRemoteDataSource {
  async login(email: string, password: string): Promise<LoginResponseDto> {
    const response = await apiClient.post<LoginResponseDto>('/auth/login', {
      email,
      password,
    });
    return response.data;
  }
}
