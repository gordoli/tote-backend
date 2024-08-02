import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import * as supabaseJs from '@supabase/supabase-js';

export class LoginResponse<
  User extends supabaseJs.User,
  Session extends supabaseJs.Session,
  WeakPassword extends supabaseJs.WeakPassword,
> {
  user: User;
  session: Session;
  weakPassword?: WeakPassword;
}
