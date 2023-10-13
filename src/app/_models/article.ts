import { DecimalPipe } from '@angular/common';
import { Step } from './step';
import { User } from './user';

export interface Article
{
    id:number;
    title: string;
    articleType: number;
    subCategory: number;
    description: string;
    readCount: number;
    subCategoryId: string;
    categoryId: number;
    frontPage: string;
    isbn1: string;
    isbn2: string;
    isbn3: string;
    publisherId: number;
    isSameUser: boolean;
    maxPrice: number;
    rejectionSuggestions: string;
    minPrice: number;
    createdDate: Date;
    steps : Step[];
    commentCount: any;
    user: User;
    firstName: string;
    isSaved: boolean;
    lastName: string;
    articleCode: string;
    profileImage: string;
    job: string;
    selectedStepId: any;
}