import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import process from "node:process";

const rootDir = process.cwd();
const backendDir = process.env.BACKEND_DIR || join(rootDir, "backend");
const frontendDir = process.env.FRONTEND_DIR || join(rootDir, "frontend");

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!existsSync(backendDir)) {
  fail(`Erreur: dossier backend introuvable: ${backendDir}`);
}

if (!existsSync(frontendDir)) {
  fail(`Erreur: dossier frontend introuvable: ${frontendDir}`);
}

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

function installDepsIfNeeded(dir, name) {
  if (existsSync(join(dir, "node_modules"))) {
    return;
  }

  console.log(`Installation des dependances pour ${name}...`);
  const hasLock = existsSync(join(dir, "package-lock.json"));
  const installCmd = hasLock ? "ci" : "install";
  const result = spawn(npmCmd, [installCmd], {
    cwd: dir,
    stdio: "inherit",
    shell: false,
  });

  return new Promise((resolve, reject) => {
    result.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Echec installation ${name} (code ${code ?? "null"})`));
    });
    result.on("error", reject);
  });
}

function runDev(dir, name) {
  console.log(`Lancement du ${name}...`);
  return spawn(npmCmd, ["run", "dev"], {
    cwd: dir,
    stdio: "inherit",
    shell: false,
  });
}

const main = async () => {
  await installDepsIfNeeded(backendDir, "backend");
  await installDepsIfNeeded(frontendDir, "frontend");

  const backend = runDev(backendDir, "backend");
  const frontend = runDev(frontendDir, "frontend");

  const shutdown = () => {
    if (!backend.killed) backend.kill();
    if (!frontend.killed) frontend.kill();
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  process.on("exit", shutdown);

  backend.on("exit", (code) => {
    if (code && code !== 0) {
      shutdown();
      process.exit(code);
    }
  });

  frontend.on("exit", (code) => {
    shutdown();
    process.exit(code ?? 0);
  });
};

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
