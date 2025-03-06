import next from "eslint-config-next";
import tseslint from "typescript-eslint";

export default tseslint.config(
  ...next.configs["core-web-vitals"],
  ...next.configs["typescript"],
  {
    ignores: ["**/*.config.js", ".next", "node_modules"],
  }
);
