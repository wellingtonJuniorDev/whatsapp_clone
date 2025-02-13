using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Whatsapp.Clone.Configurations;
using Whatsapp.Clone.Data;
using Whatsapp.Clone.Entities;
using Whatsapp.Clone.ViewModels;

namespace Whatsapp.Clone.Routes
{
    public static class UserRoutes
    {
        public static WebApplication RegisterUserRoutes(this WebApplication app)
        {
            app.MapGet("users", async (
                UserManager<ApplicationUser> userManager,
                ChatDbContext chatContext,
                HttpContext httpContext
            ) =>
            {
                var userId = httpContext.User.GetUserId();

                var users = await userManager.Users
                    .Where(user => user.Id !=  userId)
                    .OrderBy(user => user.Name)
                    .Select(user => new UserChatViewModel(
                        user.Id,
                        user.Name,
                        user.Email,
                        null,
                        null
                    ))
                    .ToArrayAsync();

                var relations = users
                    .Select(u => ChatMessage.MakeRelation(u.Id, userId))
                    .ToArray();

                var tasks = relations
                    .Select(async (relation) => await chatContext
                        .Messages
                        .Where(m => m.Relation == relation)
                        .OrderByDescending(m => m.Timestamp)
                        .FirstOrDefaultAsync()
                    );

                var messages = await Task.WhenAll(tasks);

                users = users.Select(user =>
                {
                    var lastMessage = messages
                        .SingleOrDefault(m => m != null && ChatMessage.MakeRelation(userId, user.Id) == m.Relation);

                    return user with
                    {
                        Last = lastMessage?.Message,
                        Date = lastMessage?.Timestamp.ToLocalTime().ToShortDateString()
                    };
                }).ToArray();

                return Results.Ok(users);
            })
            .RequireAuthorization();

            return app;
        }
    }
}
