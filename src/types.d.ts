declare module "xorshift.js" {
  export class XorShift128Plus {
    constructor(seed: [number, number, number, number]);
    random(): number;
  }
}
