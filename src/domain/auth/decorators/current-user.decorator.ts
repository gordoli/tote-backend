import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { supabase } from 'src/main';

export const CurrentUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return await supabase.auth.getUser(request.user);
  },
);
