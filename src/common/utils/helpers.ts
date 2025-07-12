export const isTokenExpired = (decodedToken: { exp: number }): boolean => {
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTime;
};
