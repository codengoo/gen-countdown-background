type RotationMode = "random" | "sequential";

export class Rotation {
  private keys: string[];
  private mode: RotationMode;

  constructor(keyList: string[]) {
    if (!keyList.length) throw new Error("Key list is empty.");
    this.keys = keyList;
    this.mode = "random";
  }

  public next() {
    if (this.mode === "random") return this.keys[Math.floor(Math.random() * this.keys.length)];
    else throw new Error("Not specify mode yet.");
  }
}
