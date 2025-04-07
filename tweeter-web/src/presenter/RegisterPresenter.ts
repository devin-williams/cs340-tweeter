import { AuthPresenter } from "./AuthPresenter";
import { Buffer } from "buffer";

export class RegisterPresenter extends AuthPresenter {

  public async authenticate(
    alias: string,
    password: string,
    rememberMe: boolean = false,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string
  ): Promise<void> {
    await this.doAuthenticate(() =>
      this.service.register(
        firstName || "",
        lastName || "",
        alias,
        password,
        imageBytes || new Uint8Array(),
        imageFileExtension || ""
      ), rememberMe);
  }

  protected getItemDescription(): string {
    return "register user";
  }

  public handleFileChange(
    file: File | undefined,
    setImageUrl: (url: string) => void,
    setImageBytes: (bytes: Uint8Array) => void,
    setImageFileExtension: (extension: string) => void
  ): void {
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        setImageFileExtension(fileExtension);
      }
    } else {
      setImageUrl("");
      setImageBytes(new Uint8Array());
      setImageFileExtension("");
    }
  }

  private getFileExtension(file: File): string {
    return file.name.split(".").pop() || "";
  }
}
