import { User } from 'src/database';

export class LoginResponse {
  user: User;
  sessionExpiry: number;
  accessToken: string;
  refreshToken: string;
}
