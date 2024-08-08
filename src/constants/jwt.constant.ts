export const JWT_CONSTANT = {
  STRATEGIES: {
    USER_TOKEN: 'jwt_user_token',
    REFRESH_USER_TOKEN: 'jwt_refresh_user_token',
  },

  //TODO: Change this to 5 minutes
  EXPIRE_SECONDS: 10000000 * 60 * 60,
  ACCESS_TOKEN_EXPIRE: 100000000 * 60,

  // EXPIRE_SECONDS: 10 * 60 * 60,
  // ACCESS_TOKEN_EXPIRE: 5 * 60,
};
