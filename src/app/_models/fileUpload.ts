import { Highlight } from "./highlight";

export interface FileUpload {
  id: string;
  description: string;
  title: string;
  file: any;
  publicId: string;
  url: string;
  imageType: any;
  articleType: any;
  UploadedOn: Date;
}
