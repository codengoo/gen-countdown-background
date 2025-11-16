import fs from "fs-extra";
import JavaScriptObfuscator from "javascript-obfuscator";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",

  // 🔥 Gom toàn bộ library vào 1 file
  bundle: true,
  splitting: false,
  format: ["cjs"],

  // Không exclude thư viện
  external: ["canvas"],
  noExternal: [], // đảm bảo không tách phụ thuộc

  clean: true,
  minify: false,
  sourcemap: false,
  dts: false,

  async onSuccess() {
    const file = "dist/index.js";

    const code = fs.readFileSync(file, "utf8");
    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.3,
      stringArray: true,
      stringArrayThreshold: 1,
      stringArrayEncoding: ["base64"],
      rotateStringArray: true,
      disableConsoleOutput: true,
    });

    fs.writeFileSync(file, obfuscated.getObfuscatedCode(), "utf8");
    fs.copy("node_modules", "dist/node_modules");
    console.log("✔ Bundle + Obfuscate hoàn tất!");
  },
});
