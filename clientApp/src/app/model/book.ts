export class Book{
    _id?: string;
    name!: string;
    author!: string;
    rating?: number;
    favorited!: boolean;
    toBeRead!: boolean;
}