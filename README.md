# Karma GAP Indexer

> Required NodeJS@^16.0

## Starting

1. `cp .env-example .env` and fill necessary params
2. `npm install` or `yarn`
3. `npm run dev` or `yarn dev`

Production build uses `yarn prod`, compiles to `.dist`

## Development

### Routes and Controllers

Set up routes at `app/modules/routes/routes.ts` importing the correct functions to the application.
You should use Controllers at `app/modules/controller` to create database communication methods, and
set up viewers at `app/modules/routes/route-domain` to instantiate and call controller's methods.

```ts
import { AbstractMongoDBEntity } from '@/abstract/AbstractMongoDBEntity';
import { MyDataModel } from '@/interfaces/MyDataModel';

class MyController extends AbstractMongoDBEntity {
  protected table = 'MyTable';
  protected data: MyDataModel;

  constructor(data?: MyDataModel) {
    super();
    this.data = data;
  }

  async getCertainDocument() {
    const collection = this.mongo.collection(this.table);
    const result = await collection.findAll();
    this.disconnect();
    return result;
  }

  async overrideFindOne(query: FilterQuery<any>, opts?: FindOneOptions<any>) {
    return await this.findOne(query, opts);
  }
  // ... other methods
}
```

### CryptoJsHandler

`CryptoJsHandler::class` provides encryption and decryption methods. To start using, create a ssh key called `crypto-js` in `app/.shh`.

```ts
import { CryptoJsHandler } from '@/util/CryptoJSHandler';

// Instantiates the handler
const handler = new CryproJSHandler();

// Encrypt some string
const encrypted = handler.encrypt('MySensitiveData123');
// encrypted = "e69b2774de366007b336f5cb0ea8ecb4336cbd69a4a5e6d4c7068fd59866a384"

// Decript some string
const decrypted = handler.decrypt(encrypted);
// decrypted = "MySensitiveData123"
```

### Documentation

Keep the documentation up to date before pushing up.

### Services

Services are classes used to perform outside world communication such as any API, or external integration.
The orientation of use will vary between Controllers and viewers, depending on what kind of job it will do. For example,
if you need to proxy a request, use inside a viewer. If you need to check something while processing data, use inside
a controller method.

> Avoid using static methods and keep the single responsibility standard up to date.
> Use interfaces to better organize entities and control the data flow.

## Scripts

Run `yarn run-script` to get examples.

## Deploy

Deploy this application using `docker-compose up -d --build`.

> Before deploying, change `docker-compose.yml` with a secure username and password to the DB
> and add it to the `.env` file.

> Verify `docker-compose`'s ports to avoid conflicts.
