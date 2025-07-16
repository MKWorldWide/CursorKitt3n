import { cursorKittenRules } from "../rules/cursorKitten.js";

export const CursorKitten = {
  name: "CursorKitten",
  env: "dev",
  execute: cursorKittenRules.transform
};
