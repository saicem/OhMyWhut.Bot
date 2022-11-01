import {stat, writeFile} from "fs/promises";

class FileHandler {
  async writeFile(filename: string, content: Buffer) {
    await writeFile(`cacheFolder${filename}`, content);
  }

  async hasFile(filename: string) {
    try {
      return (await stat(filename)).isFile();
    } catch (e) {
      return false;
    }
  }
}

export const fileHandler = new FileHandler();
