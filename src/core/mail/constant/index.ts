export enum MAIL_TEMPLATE {
  RESET_PASSWORD = 'reset-password',
  FORGOT_PASSWORD = 'forgot-password-otp',
  VERIFY_EMAIL = 'verify-email-otp',
  TEST = 'test',
}

export enum MAIL_TYPE_KEYS {
  TEST = 'TEST',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

export const MAIL_TYPE = {
  [MAIL_TYPE_KEYS.TEST]: {
    subject: 'Tote',
    template: MAIL_TEMPLATE.TEST,
    // dataFields: [],
  },
  [MAIL_TYPE_KEYS.VERIFY_EMAIL]: {
    subject: 'Verify account OTP',
    template: MAIL_TEMPLATE.VERIFY_EMAIL,
  },
  [MAIL_TYPE_KEYS.FORGOT_PASSWORD]: {
    subject: 'Forgot password OTP',
    template: MAIL_TEMPLATE.FORGOT_PASSWORD,
  },
  [MAIL_TYPE_KEYS.RESET_PASSWORD]: {
    subject: 'Reset password',
    template: MAIL_TEMPLATE.RESET_PASSWORD,
  },
};
