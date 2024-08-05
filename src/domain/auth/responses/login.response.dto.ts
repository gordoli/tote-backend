import * as supabaseJs from '@supabase/supabase-js';

export class LoginResponse {
  user: supabaseJs.User;
  session: supabaseJs.Session;
  weakPassword?: supabaseJs.WeakPassword;
}
