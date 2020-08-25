declare module "xorshift" {
  export type XorShift = {
    random: () => number;
  };
  export const constructor: {
    new (seed: [number, number, number, number]): XorShift;
  };
}
