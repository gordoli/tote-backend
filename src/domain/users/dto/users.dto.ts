import { IsOptional } from 'class-validator';
import { BaseFilter } from 'src/library';

export class SearchMembersDto extends BaseFilter {
  @IsOptional()
  email: string;

  @IsOptional()
  username: string;

  @IsOptional()
  name: string;
}

export class EditUserDto {
  @IsOptional()
  email: string;

  @IsOptional()
  username: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  avatar: string;

  constructor(data?: Partial<EditUserDto>) {
    this.email = data?.email;
    this.username = data?.username;
    this.firstName = data?.firstName;
    this.lastName = data?.lastName;
    this.avatar = data?.avatar;
  }
}
