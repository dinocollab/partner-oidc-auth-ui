import fs from "fs";
import Path from "path";
const folders = fs.readdirSync("./node_modules/@types");
const isCheck = (path) => {
  return fs.existsSync(
    Path.join("./node_modules/@types", path, "node_modules/@types/react")
  );
};
const remove = (path) => {
  path = Path.join("./node_modules/@types", path, "node_modules");
  fs.rmSync(path, { force: true, recursive: true });
};
const paths = folders.filter(isCheck);
paths.forEach((x) => remove(x));
