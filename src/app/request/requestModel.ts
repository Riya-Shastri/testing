export class RequestModel {
    // Fields
    Filters: any;
    Paging: Paging;
    Sorting: Sorting[];
  }

  export class Paging {
    PageNo: number;
    PageSize: number;
  }
  
  export class Sorting {
    ColumnName: string;
    SortOrder: string;
  }