export function chunkify<T>(arr: T[], size: number): T[][] {
  return arr.reduce((acc, _, i) => {
    if (!(i % size)) {
      acc.push(arr.slice(i, i + size));
    }
    return acc;
  }, []);
}
