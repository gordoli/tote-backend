import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserRepository } from 'src/database';
import {
  ChangePasswordDTO,
  ForgotPasswordDTO,
  RegistrationDTO,
  ResetPasswordDTO,
  VerifyForgotPasswordDTO,
} from '../dto';
import { LoggerService } from 'src/core/logger';

@Injectable()
export class AuthUserService {
  private _logger = new LoggerService(AuthUserService.name);
  constructor(private _userRepository: UserRepository) {}

  public async getProfile(payload: Partial<User>) {
    return this._userRepository.findOneBy({ id: payload.id });
  }

  public async findUser(email: string) {
    return await this._userRepository.findByIdentity(email);
  }

  public async logout(user: User) {
    // TODO
  }

  public async changePassword(user: User, dto: ChangePasswordDTO) {
    // TODO
  }

  public async forgotPassword(dto: ForgotPasswordDTO) {
    // TODO
  }

  public async verifyForgotPassword(dto: VerifyForgotPasswordDTO) {
    // TODO
  }

  public async resetPassword(dto: ResetPasswordDTO) {
    // TODO
  }

  public async registration(registerDto: RegistrationDTO) {
    const user = new User(registerDto);
    if (!(await this.usernameIsUnique(registerDto.username))) {
      throw new ConflictException('Username already exists');
    }
    await this._userRepository.save(user);
  }

  public async usernameIsUnique(username: string) {
    const foundUsers = await this._userRepository
      .createQueryBuilder('user')
      .where('user.username ILIKE :username', {
        username: `${username?.toLowerCase() || ''}%`,
      })
      .andWhere('user.deletedAt ISNULL')
      .select(['user.id', 'user.username'])
      .getMany();
    return foundUsers.length == 0;
  }

  public async verifyEmail(email: string) {
    const result = await this._userRepository.verifyByEmail(email);
    this._logger.debug('Verified update result', result);
  }
}
