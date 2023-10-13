import { Step } from 'src/app/_models/step';

export class StepEdit{
    stepEditCollection: Step[]
}

export class HighlightAdd{
    highlightedPart : string;
    stepId : number;
}