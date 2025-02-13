namespace Whatsapp.Clone.Data
{
    public class Pagination<T>
    {
        public IEnumerable<T> Itens { get; set; }
        public int CurrentPage { get; private set; }
        public int TotalPages { get; private set; }
        public int PageSize { get; private set; }
        public int TotalCount { get; private set; }

        public bool HasPrevious => CurrentPage > 0;
        public bool HasNext => CurrentPage < (TotalPages - 1);

        public Pagination(IEnumerable<T> items, int count, int pageNumber, int pageSize)
        {
            TotalCount = count;
            PageSize = pageSize;
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);

            Itens = items;
        }
    }
}
