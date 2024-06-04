export const MESSAGE_CONSTANT = {
  SUCCESS: 'Operation completed successfully.',
  USER: {
    NOT_FOUND: 'User not found. Please check your credentials and try again.',
    DISABLED:
      'This user account has been disabled. Please contact support for assistance.',
    WRONG_PASSWORD: 'Incorrect password. Please try again.',
    WRONG_CURRENT_PASSWORD:
      'The current password you entered is incorrect. Please try again.',
    USER_ALREADY_EXISTS:
      'An account with this email already exists. Please log in or use a different email.',
    WRONG_TOKEN: 'The provided token is invalid. Please request a new one.',
    TOKEN_EXPIRED:
      'The token has expired. Please request a new token to proceed.',
    VERIFY_SUCCESS: 'Your email has been successfully verified.',
    MAIL_NEW_PASSWORD:
      'Your new password has been sent to your email. Please check your inbox and follow the instructions to reset your password',
  },
  OTP: {
    INVALID:
      'The OTP is invalid or has expired. Please request a new OTP and try again.',
    SENT_TO_EMAIL:
      'OTP has been sent to your email address. Please check your inbox.',
  },
};
