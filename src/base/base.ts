import { CanvasRenderingContext2D } from "canvas";

export abstract class BaseDraw {
    public abstract draw(ctx: CanvasRenderingContext2D, ...args: any[]): void | Promise<void>;
}