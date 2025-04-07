export interface ISessionDAO {
    storeToken(token: string, alias: string): Promise<void>;
    isTokenValid(token: string): Promise<boolean>;
    deleteToken(token: string): Promise<void>;
    getAliasForToken(token: string): Promise<string>;
  }
  