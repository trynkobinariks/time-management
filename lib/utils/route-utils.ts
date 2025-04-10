export const isAuthPage = (pathname: string): boolean => {
  return pathname.startsWith('/auth');
};
