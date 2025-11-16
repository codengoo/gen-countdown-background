import moment from "moment";
import { Painter } from "./painter";
import { Text } from "./text";

interface IEvent {
  name: string;
  time: Date;
  outputPath: string;
}

export class Event {
  constructor(private readonly event: IEvent) {}

  private calcDayLeft() {
    const dayLeft = moment(this.event.time).startOf("day").diff(moment().startOf("day"), "days");
    return Math.abs(dayLeft).toString();
  }

  public createCountdown(): string {
    const painter = new Painter({
      outputFolder: this.event.outputPath,
      height: 300,
      width: 700,
    });

    // await painter.drawBackground();
    const eventName = new Text({
      color: "#FFFFFF",
      position: { x: 300, y: 250 },
      fontFamily: "Fz Fashion Signature",
      fontSize: 80,
    });

    const dayLeft = new Text({
      color: "#B23F43",
      position: { x: 300, y: 100 },
      fontFamily: "Audiowide",
      fontSize: 200,
    });

    const dayText = new Text({
      color: "#B23F43",
      position: { x: 500, y: 100 },
      fontFamily: "Koulen",
      fontSize: 60,
      rotate: Math.PI / 2,
    });

    painter.drawText([eventName, dayLeft, dayText], [`Đến ${this.event.name}`, this.calcDayLeft(), "DAYS"]);

    return painter.save();
  }
}
