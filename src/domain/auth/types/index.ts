export type SocialData = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export enum SendOTPType {
  VERIFY_EMAIL = 'verify_email',
  FORGOT_PASSWORD = 'forgot_password',
}
