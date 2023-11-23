// import { config } from '../../config/config';
// import { IFilter } from '../../types';

// export abstract class PrismaController {
//   protected db = config.prisma.instance.attestation;

//   abstract getAll(filters?: IFilter[]): Promise<unknown>;

//   async getByRecipient(recipient: string, type: string, filters?: IFilter[]) {
//     const items = await this.db.findMany({
//       orderBy: {
//         createdAt: 'desc',
//       },
//       where: {
//         revoked: false,
//         recipient,
//         type,
//         ...(filters?.length === 0
//           ? {}
//           : {
//               OR: filters,
//             }),
//       },
//     });

//     return items;
//   }

//   async getByRefUids(uids: string[], type: string, filters?: IFilter[]) {
//     const items = await this.db.findMany({
//       orderBy: {
//         createdAt: 'desc',
//       },
//       where: {
//         revoked: false,
//         refUID: {
//           in: uids,
//         },
//         type,
//         ...(filters?.length === 0
//           ? {}
//           : {
//               OR: filters,
//             }),
//       },
//     });

//     return items;
//   }

//   async getIn(propName: string, uids: string[], filters?: IFilter[]) {
//     const items = await this.db.findMany({
//       orderBy: {
//         createdAt: 'desc',
//       },
//       where: {
//         revoked: false,
//         [propName]: {
//           in: uids,
//         },
//         ...(filters?.length === 0
//           ? {}
//           : {
//               OR: filters,
//             }),
//       },
//     });

//     return items;
//   }

//   /**
//    * Get all attestations of a type
//    * @param type
//    * @returns
//    */
//   getAllOfType(type: string, filters?: IFilter[]) {
//     return this.db.findMany({
//       orderBy: {
//         createdAt: 'desc',
//       },
//       where: {
//         revoked: false,
//         type,
//         ...(filters?.length === 0
//           ? {}
//           : {
//               OR: filters,
//             }),
//       },
//     });
//   }

//   /**
//    * Get all attestations by ID
//    * @param id
//    * @returns
//    */
//   getById(id: number) {
//     return this.db.findFirst({
//       where: {
//         id,
//       },
//     });
//   }

//   /**
//    * Get all attestations by UID
//    * @param uid
//    * @returns
//    */
//   getByUid(uid: string) {
//     return this.db.findFirst({
//       where: {
//         uid,
//       },
//     });
//   }

//   /**
//    * Get all attestations by refUID
//    * @param propPath
//    * @param value
//    */
//   getByProp(propPath: string, value: string) {
//     return this.db.findFirst({
//       orderBy: {
//         createdAt: 'desc',
//       },
//       where: {
//         data: {
//           path: [propPath],
//           equals: value,
//         },
//         revoked: false,
//       },
//     });
//   }

//   /**
//    * Get all attestations by refUID
//    * @param propPath
//    * @param value
//    */
//   getManyByProp(propPath: string, value: string, type: string) {
//     return this.db.findMany({
//       orderBy: {
//         createdAt: 'desc',
//       },
//       where: {
//         data: {
//           path: [propPath],
//           equals: value,
//         },
//         type,
//         revoked: false,
//       },
//     });
//   }
// }
