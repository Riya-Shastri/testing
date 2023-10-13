import { DecimalPipe } from "@angular/common";
import { Step } from "./step";
import { User } from "./user";

export interface ArticleSeries {
  id: number;
  seriesTitle: string;
  shortName: string;
  createdOn: Date;
  modifiedOn: Date;
  user: User;
}
