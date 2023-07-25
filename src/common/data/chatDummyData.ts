import USERS, { IUserProps } from './userDummyData';
import React, {useState, useEffect} from 'react'



export interface IMessages {
    id: number;
    conversation: string;
    messages: { id: number; message: string }[];
    is_user: boolean;
    timestamp?: string;
    text: string;
    created_at: string;
    user: IUserProps
    isLastMessage?: boolean;
    isFile?:boolean;
    fileName?:string;
}


