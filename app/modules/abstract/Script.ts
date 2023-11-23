export class Script {
  constructor(
    public readonly name: string,
    public readonly run: (args?: any) => Promise<void>,
    public readonly description?: string,
    public readonly args?: Record<string, string>
  ) {}

  /**
   * Get parameters from command line.
   * @param paramList
   * @example
   * const params = this.getParameters({
   *  daoName: '--dao-name:string', // <-- string is implicit no need of defining it
   *  days: '--days:number',
   * });
   * console.log(params.daoName); // 'my-dao'
   * console.log(params.days); // 10
   * console.log(params.someOtherParam); // undefined
   * console.log(params.someOtherParam || 10); // 10
   */
  getParameters<ReturnType = undefined, ParamList = unknown>(
    paramList: ParamList
  ): ReturnType extends undefined ? ParamList : ReturnType {
    type ReturnTypes = ReturnType extends undefined ? ParamList : ReturnType;

    const result: ReturnTypes = Object.entries(paramList).reduce(
      (acc, [key, def]) => {
        const [paramKey, type] = def.split(':');
        const paramIdx = process.argv.indexOf(paramKey);
        let paramValue;
        if (~paramIdx) {
          switch (type) {
            case 'bool':
              paramValue = true;
              break;
            case 'number': {
              const value = process.argv[paramIdx + 1].trim();
              paramValue = Number.isSafeInteger(+value) ? +value : undefined;
              break;
            }
            default:
              paramValue = process.argv[paramIdx + 1].trim();
          }
        }
        acc[key] = paramValue;
        return acc;
      },
      {} as ReturnTypes
    );
    return result;
  }
}
