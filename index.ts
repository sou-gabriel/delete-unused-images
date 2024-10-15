import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

const IMAGES_DIR_PATH = process.env.IMAGES_DIR_PATH || "";
const HTML_FILE_PATH = process.env.HTML_FILE_PATH || "";

if (!IMAGES_DIR_PATH) {
  throw new Error('env: "IMAGES_DIR_PATH" is required');
}

if (!HTML_FILE_PATH) {
  throw new Error('env: "HTML_FILE_PATH" is required');
}

function getImagesFromDirectory(directory: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        return reject(err);
      }

      const imageFiles = files.filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return [
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".bmp",
          ".svg",
          ".webp",
        ].includes(ext);
      });

      resolve(imageFiles);
    });
  });
}

function readHtmlFile(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

async function deleteUnusedImages() {
  const images = await getImagesFromDirectory(IMAGES_DIR_PATH);
  const html = await readHtmlFile(HTML_FILE_PATH);

  images.forEach((image) => {
    const inUse = html.includes(image);
    const imagePath = path.join(IMAGES_DIR_PATH, image);

    if (!inUse) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.log(`Erro ao excluir arquivo "${image}"`);
        }

        console.log(`Imagem "${image}" excluída com sucesso!`);
      });
    }
  });
}

deleteUnusedImages();
