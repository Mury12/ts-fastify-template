import { HttpException } from '../util/error/HttpException';

export class ExampleController /** extends MyGenericDBController */ {
  protected defaultAttrs = ['id', 'username', 'email', 'role', 'status'];

  constructor(data?: any) {
    // super();
    // this.data = data;
    // this.table = 'ExampleTable';
  }

  async getOne() {
    // Call to parent class
    // return this.findOne({
    //   id: this.data.id,
    // });
    return { name: 'example' };
  }

  async getAll(/** filters: IFilter */) {
    // Call to parent class or override
    // return this.findAll(filters);

    return [{ name: 'example' }, { name: 'example2' }];
  }

  async create() {
    // Call to parent class
    // return this.insert(this.data);
    // no return needed (http 201 = created)
  }

  async update() {
    // Call to parent class
    // return this.updateOne(this.data);
    // no return needed (http 204 = no content)
  }

  async remove() {
    // Call to parent class
    // return this.deleteOne(this.data);
    // no return needed (http 204 = no content)
  }

  async errorExample() {
    throw new HttpException('Error example', 422, {
      error: 'Error example',
      message: 'This is an example of an error.',
      description:
        'HttpException will be catched by the global error handler. @see hooks/on-error.ts',
    });
  }
}
