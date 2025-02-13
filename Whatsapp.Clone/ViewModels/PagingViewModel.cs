namespace Whatsapp.Clone.ViewModels
{
    public class PagingViewModel 
    {
        const int maxPageSize = 40;

        private int _pageNumber = 0;
        public int PageNumber
        {
            get => _pageNumber;
            set
            {
                _pageNumber = (value < 0) ? 0 : value;
            }
        }

        private int _pageSize = 10;
        public int PageSize
        {
            get => _pageSize;
            set
            {
                if (value <= 0)
                {
                    _pageSize = 10;
                    return;
                }
                _pageSize = (value > maxPageSize) ? maxPageSize : value;
            }
        }
    }
}
