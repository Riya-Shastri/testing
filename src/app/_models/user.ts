import { Follower } from './follower';

export interface User
{
    id:number;
    firstName:string;
    lastName:string;
    documentId: string;
    modifiedDate:string;
    job:string;
    profileImage: any;
    email: string;
    image: string;
    coverImage: string;
    Articles?: Articles[];
    isActivated: boolean;
    joinedDate: Date;
    userRoles: any;
    token: any;
    userName: string;
    followers? : Follower[]
}

export interface Articles{
    id: number;
    title: string;
}