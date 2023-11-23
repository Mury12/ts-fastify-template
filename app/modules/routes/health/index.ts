import { Module } from "./health.module";

/**
 * Exports the users actions routes.
 * @param {*} router
 * @param {*} options
 */
export const health = async (router, options) => {
  router.get("/", Module.status);
};

export const name = Module.name;
