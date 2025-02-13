using Whatsapp.Clone.ViewModels;

namespace Whatsapp.Clone.Configurations
{
    public static class HttpContextExtensions
    {
        public static PagingViewModel GetPaging(this HttpContext context)
        {
            int.TryParse(context.Request.Query["pageSize"], out int pageSize);
            int.TryParse(context.Request.Query["pageNumber"], out int pageNumber);

            return new PagingViewModel
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
    }
}
