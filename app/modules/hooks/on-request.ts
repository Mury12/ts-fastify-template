import { FastifyReply, FastifyRequest } from "fastify";
import { config } from "../../config/config";
import { ActionLogger } from "../middleware/ActionLogger";
import sha256 from "sha256";

export const onRequest = async (req: FastifyRequest, res: FastifyReply) => {
  if (config.logging) {
    if (["any", "action-only"].includes(config.logLevel))
      ActionLogger(req, res);
  }

  const key = sha256(req.url);

  if (config.redis.instance && req.method === "GET") {
    const cache: any = await config.redis.instance.get(key);
    if (cache) {
      res.header("X-Cache", "HIT");
      res.header("content-type", "application/json");
      res.send(JSON.parse(cache));
    }
  }
};
