import { SafeResourceUrl } from "@angular/platform-browser";
import { Action } from "ngx-bootstrap";

export interface Image {
    id: number;
    modal: ModalImage;
    plain?: PlainImage;
    constructor(id: number, modal: ModalImage, plain?: PlainImage);
}

export interface ImageData {
    img: string | SafeResourceUrl;
    description?: string;
    title?: string;
    alt?: string;
    ariaLabel?: string;
    angle?: number;
}
/**
 * Interface `ModalImage` to configure the modal image.
 */
export interface ModalImage extends ImageData {
    extUrl?: string;
    downloadFileName?: string;
}
/**
 * Interface `PlainImage` to configure the plain image.
 */
export interface PlainImage extends ImageData {
    size?: Size;
}
/**
 * Class `ImageEvent` that represents the event payload with the result and the triggered action.
 */
export declare class ImageEvent {
    action: Action;
    result: number | boolean;
    constructor(action: Action, result: number | boolean);
}
/**
 * Class `ImageModalEvent` that represents the event payload with the result and the triggered action.
 */
export declare class ImageModalEvent extends ImageEvent {
    constructor(action: Action, result: number | boolean);
}

export interface Size {
    width: string;
    height: string;
}