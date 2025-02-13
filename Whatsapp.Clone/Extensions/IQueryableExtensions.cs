using Microsoft.EntityFrameworkCore;
using Whatsapp.Clone.Data;

namespace Whatsapp.Clone.Extensions
{
    public static class IQueryableExtensions
    {
        public static async Task<Pagination<T>> ToPaginationAsync<T>(
            this IQueryable<T> source, 
            int pageNumber,
            int pageSize)
        {
            var count = await source.CountAsync();
            var items = await source
                .Skip(pageNumber * pageSize)
                .Take(pageSize)
                .ToArrayAsync();

            return new Pagination<T>(items, count, pageNumber, pageSize);
        }
    }
}
