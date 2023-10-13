
export interface Comments
{
    id:number;
    articleId: number;
    userId: number;
    content: string;
    description: string;
    createdDate: Date;
    updatedDate : Date;
    firstName: string;
    lastName: string;
    profileImage: string;
    job: string;
}