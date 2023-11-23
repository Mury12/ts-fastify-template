export function assertParams<T>(
  body: T,
  params: (keyof typeof body)[],
  index?: number
) {
  const missing = params.filter((p) => !body[p]);
  if (missing.length) {
    throw new Error(
      `Missing params${index ? ` at index${index}` : ''}: ${missing.join(', ')}`
    );
  }
}
