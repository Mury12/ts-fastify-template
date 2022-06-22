import { AbstractMongoDBEntity } from "../abstract/AbstractMongoDBEntity";

export class ExampleController extends AbstractMongoDBEntity {
  protected defaultAttrs = ["id", "username", "email", "role", "status"];

  constructor(data?: any) {
    super();
    this.data = data;
    this.table = "ExampleTable"
  }

  async getOne() {
    return this.findOne({
      id: this.data.id,
    });
  }
}
