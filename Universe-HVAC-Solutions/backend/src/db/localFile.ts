import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function filePath(name: string): string {
  return path.join(DATA_DIR, name);
}

function ensureFile(name: string) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const p = filePath(name);
  if (!fs.existsSync(p)) fs.writeFileSync(p, "[]", "utf-8");
}

export function readLocal<T>(name: string): T[] {
  ensureFile(name);
  const raw = fs.readFileSync(filePath(name), "utf-8");
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export function writeLocal<T>(name: string, rows: T[]) {
  ensureFile(name);
  fs.writeFileSync(filePath(name), JSON.stringify(rows, null, 2), "utf-8");
}
