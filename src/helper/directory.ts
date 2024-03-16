import path from "path";

// The following directories pre-exists inside the project
export const ROOT_DIR = path.resolve(process.cwd());

// The following directories are created during application runtime
export const OUT_DIR = `${ROOT_DIR}/out`;
export const WP_DIR = `${OUT_DIR}/wp`;
