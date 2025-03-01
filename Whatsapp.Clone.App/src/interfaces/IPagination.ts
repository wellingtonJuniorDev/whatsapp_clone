export interface ISearch {
  pageNumber: number;
  pageSize: number;
  hasNext:boolean;
}

export interface IPagination<T> {
  itens: T[];
  currentPage: number;
  totalPages: number;
  pageSize : number;
  totalCount : number;

  hasPrevious :boolean;
  hasNext:boolean;
}
