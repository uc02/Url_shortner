import { model, models, Schema } from "mongoose";

export interface IUrl {
  originalUrl: string;
  UniqueCode: string;
  shortUrl: string;
}

const UrlSchema = new Schema<IUrl>({
  originalUrl: { type: String, required: true },
  UniqueCode: { type: String, required: true, unique: true},
  shortUrl: { type: String, required: true, unique: true }
});

const Url = models.Url || model<IUrl>('Url',UrlSchema)

export default Url

