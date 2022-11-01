import {stat, writeFile} from "fs/promises";

class FileHandler {
  async writeFile(filename: string, content: Buffer) {
    await writeFile(this.getFilePath(filename), content);
  }

  async hasFile(filename: string) {
    try {
      return (await stat(this.getFilePath(filename))).isFile();
    } catch (e) {
      return false;
    }
  }

  getFilePath(filename: string) {
    return `cacheFolder/${filename}`;
  }
}

export const fileHandler = new FileHandler();
