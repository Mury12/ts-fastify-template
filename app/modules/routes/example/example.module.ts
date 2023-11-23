import { FastifyReply, FastifyRequest } from 'fastify';
import { ExampleController } from '../../controller/Example.controller';

/**
 * GET one row from DB
 * @param {*} req
 * @param {*} res
 */
const get = async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.params as { id: string };

  const ec = new ExampleController({ id });
  const result = await ec.getOne();

  if (result) res.send(result);
  else res.code(422).send(result);
};

/**
 * GET all rows from DB
 * @param {*} req
 * @param {*} res
 */
const getAll = async (req: FastifyRequest, res: FastifyReply) => {
  const ctl = new ExampleController();
  const result = await ctl.getAll();
  res.send(result);
};
/**
 * Inserts a new row into DB
 * @param {*} req
 * @param {*} res
 */
const create = async (req: FastifyRequest, res: FastifyReply) => {
  const data = req.body;
  const ctl = new ExampleController(data);
  await ctl.create();
  res.code(201).send();
};
/**
 * Update a row into DB
 * @param {*} req
 * @param {*} res
 */
const update = async (req: FastifyRequest, res: FastifyReply) => {
  const data = req.body;
  const ctl = new ExampleController(data);
  await ctl.update();
  res.code(204).send();
};
/**
 * Removes a row from DB
 * @param {*} req
 * @param {*} res
 */
const remove = async (req: FastifyRequest, res: FastifyReply) => {
  const data = req.body;
  const ctl = new ExampleController(data);
  await ctl.remove();
  res.code(204).send();
};

const errorExample = async (req: FastifyRequest, res: FastifyReply) => {
  const data = req.body;
  const ctl = new ExampleController(data);
  await ctl.errorExample();
  res.code(204).send();
};

export const Module = {
  name: 'example',
  get,
  getAll,
  create,
  update,
  remove,
  errorExample,
};
