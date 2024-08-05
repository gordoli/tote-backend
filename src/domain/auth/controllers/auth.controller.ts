import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import { User } from 'src/database';
import { BaseController } from 'src/library';
import { Public } from '../decorators';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CreateUserDTO, LoginDTO } from '../dto';
import { AuthUserService } from '../services';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginResponse } from '../responses';
import { supabase } from 'src/main';
import * as supabaseJs from '@supabase/supabase-js';

@ApiTags('Auth')
@Controller('auth')
// TODO: AuthGuard
export class AuthController extends BaseController {
  constructor(private _userService: AuthUserService) {
    super();
  }

  @Get('profile')
  public async profile(@CurrentUser() user: User) {
    return user.serialize();
  }

  @Post('login')
  @Public()
  @ApiUnauthorizedResponse({
    description: 'User not found, or AuthApiError from Supabase',
    type: supabaseJs.AuthApiError,
  })
  @ApiInternalServerErrorResponse({ description: 'Unknown auth errors' })
  public async login(@Body() loginDto: LoginDTO): Promise<LoginResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginDto.email,
      password: loginDto.password,
    });
    this.handleSupabaseError(error);
    return data;
  }

  @Post('logout')
  @ApiInternalServerErrorResponse({ description: 'Unknown auth errors' })
  public async logout() {
    const { error } = await supabase.auth.signOut();
    this.handleSupabaseError(error);
    return ApiOkResponse();
  }

  @Post('user')
  @ApiUnauthorizedResponse({
    description: 'User not found, or AuthApiError from Supabase',
    type: supabaseJs.AuthApiError,
  })
  public async createUser(@Body() createUserDTO: CreateUserDTO) {
    // autoconfirm: returns logged-in session
    // no autoconfirm: returns User
    const { data, error } = await supabase.auth.signUp({
      email: createUserDTO.email,
      password: createUserDTO.password,
      options: {
        data: {
          username: createUserDTO.username,
          first_name: createUserDTO.firstName,
          last_name: createUserDTO.lastName,
        },
      },
    });

    this.handleSupabaseError(error);
  }

  private handleSupabaseError(error: Error) {
    if (supabaseJs.isAuthApiError(error)) {
      if (error.code == 'user_not_found') {
        throw new UnauthorizedException();
      } else {
        throw new UnauthorizedException(`${error}`);
      }
    } else if (error) {
      throw new InternalServerErrorException(
        `Unhandled unknown error: ${error}`,
      );
    }
  }
}
