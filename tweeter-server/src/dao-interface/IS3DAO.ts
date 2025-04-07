export interface IS3DAO {
    // uploadProfileImage(alias: string, imageBytes: Buffer, extension: string): Promise<string>;
    putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
  }
  