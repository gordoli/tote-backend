import { User } from "src/database";

export class LoginResponse {
    user: User;
    accessToken: { token: string, timeout: number };
    refreshToken: { token: string, timeout: number };
}
