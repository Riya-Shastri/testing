import { Highlight } from './highlight';

export interface Step
{
    id : number;
    articleId: number;
    createdDate: Date;
    updatedDate: Date;
    content: string;
    title: string;
    isEnabled: boolean;
    highlights : any[],
    bookmarks : any[]
    pageNo: any;
}