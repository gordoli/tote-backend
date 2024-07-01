import { Injectable } from '@nestjs/common';
import { User, UserProvider, UserRepository } from 'src/database';
import { SocialData } from '../types';
import { AuthUserService } from './auth-user.service';

@Injectable()
export class UserSocialService {
  constructor(
    private _userRepository: UserRepository,
    private _userService: AuthUserService,
  ) {}

  public async upsertSocial(
    condition: Pick<User, 'socialId' | 'provider'>,
    payload: User,
  ) {
    return this._userRepository.findOneOrCreate(condition, payload);
  }

  public async socialLogin(
    socialData: SocialData,
    provider: UserProvider = UserProvider.GOOGLE,
  ) {
    const socialEmail = socialData?.email;

    const foundUser = await this._userRepository.findByLowerEmail(socialEmail);

    if (foundUser) {
      return this._userService.loginResponse(foundUser);
    }

    const userInstance = User.mapSocialProfile(socialData, provider);

    userInstance.username = await this._userService.uniqUsername(
      userInstance.email,
    );

    const socialUser = await this.upsertSocial(
      { socialId: socialData.id, provider },
      userInstance,
    );

    return this._userService.loginResponse(socialUser);
  }
}
