import type { HydratedDocument } from "mongoose";
import Docs from "@/common/db/models/docs";
import type {
  TAddDoc,
  TDoc,
  TGetDocByIdInput,
  TGetDocsInput,
  TUpdateDocInput,
} from "./docsModel";

export class DocsRepository {
  async getDocsAsync(input: TGetDocsInput): Promise<TDoc[]> {
    const { cropId, masterId } = input;
    const data: TDoc[] = await Docs.find({
      masterId,
      cropId,
    });
    return data;
  }

  async getDocByIdAsync(input: TGetDocByIdInput): Promise<TDoc | null> {
    const { id } = input;
    const data: HydratedDocument<TDoc> | null = await Docs.findById(id);
    if (!data) return null;
    return data.toJSON();
  }

  async addDocAsync(input: TAddDoc): Promise<TDoc> {
    const data = await Docs.create(input);
    return data.toJSON() as unknown as TDoc;
  }

  async deleteDocAsync(id: string): Promise<TDoc | null> {
    return await Docs.findByIdAndDelete(id);
  }

  async updateDocAsync(input: TUpdateDocInput): Promise<TDoc | null> {
    return await Docs.findByIdAndUpdate(input._id, input, {
      new: true,
    });
  }
}
