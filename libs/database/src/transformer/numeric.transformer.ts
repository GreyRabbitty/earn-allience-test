export class NumericTransformer {
  to(data: number | null): number {
    return data === null ? null : data;
  }
  from(data: string | null): number {
    return data === null ? null : parseFloat(data);
  }
}
