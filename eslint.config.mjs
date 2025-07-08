import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@next/next/no-img-element": "off",
      "no-restricted-imports": [
        "warn",
        {
          "paths": [
            {
              "name": "next/image",
              "message": "Warning: Using <Image> from `next/image` when a plain `<img>` tag would suffice can add unnecessary JavaScript and runtime overhead."
            }
          ]
        }
      ]
    },
  },
];

export default eslintConfig;
