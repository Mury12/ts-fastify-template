import {
  AggregationCursor,
  Collection,
  CollectionAggregationOptions,
  FilterQuery,
  FindOneOptions,
  InsertWriteOpResult,
  MongoCallback,
} from "mongodb";
import { IQueryFilters } from "./Query";

export interface Entity {
  create<T>(): Promise<T>;
//   createMany(...args: any): Promise<any>;
  findOne<T>(...args: any): Promise<T>;
  findAll<T>(...args: any): Promise<T[]>;
  destroy(...args: any): Promise<any>;
}

export interface MongoDBEntity extends Entity {
  findOne<T>(query: FilterQuery<any>, opts?: FindOneOptions<any>): Promise<T>;
  findAll<T>(
    filters?: IQueryFilters,
    options?: CollectionAggregationOptions,
    callback?: MongoCallback<AggregationCursor<any>>
  ): Promise<T[]>;
//   createMany<T>(
//     collection: Collection<any>,
//     data: T[]
//   ): Promise<InsertWriteOpResult<any>>;
  destroy(query: FilterQuery<any>, opts?: FindOneOptions<any>): Promise<void>;
}

export interface MysqlDBEntity extends Entity {
  createMany<T>(): Promise<T>;
}
