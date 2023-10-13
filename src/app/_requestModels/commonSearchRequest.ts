// const searchQuery: any = {
//     Filters: {
//       SubCategory: search.subCategory,
//       Title: search.title,
//       Category: search.category,
//       ArticleType: this.articleType
//     },
//     Paging: {
//       PageNo: 1,
//       PageSize: 50
//     },
//     Sorting: [
//       {
//         ColumnName: 'Value',
//         SortOrder: 'ASC'
//       }
//     ]
// //   }

export interface SearchQuery<T>{
    Filters: any;
    Paging: Paging;
    Sorting: SortingElement[]
}

export class Paging{
    PageNo: number;
    pageSize: number;
}

export class SortingElement{
    ColumnName: string;
    SortOrder: string;
}

export interface SearchFilters{
    
}
