using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Whatsapp.Clone.Configurations;
using Whatsapp.Clone.Data;
using Whatsapp.Clone.Entities;
using Whatsapp.Clone.Extensions;
using Whatsapp.Clone.Hubs;
using Whatsapp.Clone.ViewModels;

namespace Whatsapp.Clone.Routes
{
    public static class ChatRoutes
    {
        public static WebApplication RegisterChatRoutes(this WebApplication app)
        {
            app.MapPost("/chats", async (
                ChatRequestViewModel viewModel,
                HttpContext httpContext,
                IHubContext<ChatHub> hub,
                ChatDbContext chatContext
            ) =>
            {
                var modelValidation = new ChatRequestViewModelValidator().Validate(viewModel);
                if (!modelValidation.IsValid)
                {
                    return Results.BadRequest(
                        new BadRequestViewModel(modelValidation.Errors.Select(validation => validation.ErrorMessage))
                    );
                }

                var message = new ChatMessage(
                    httpContext.User.GetUserId(), 
                    viewModel.ReceiverId, 
                    viewModel.Message
                );

                await chatContext.Messages.AddAsync(message);
                await chatContext.SaveChangesAsync();

                await hub.Clients
                    .Users(message.ReceiverId, message.SenderId)
                    .SendAsync(ChatHubEvent.ReceiveMessage, (ChatViewModel) message);

                return Results.Created();
            })
            .RequireAuthorization();


            app.MapGet("/chats/{userId}", async (
                [FromRoute] string userId,
                HttpContext httpContext,
                ChatDbContext chatContext) =>
            {
                var paging = httpContext.GetPaging();

                var messages = await chatContext
                    .Messages
                    .Where(m => m.Relation == ChatMessage.MakeRelation(userId, httpContext.User.GetUserId()))
                    .OrderByDescending(m => m.Timestamp)
                    .ToPaginationAsync(paging.PageNumber, paging.PageSize);

                return Results.Ok(
                    new Pagination<ChatViewModel>(
                        messages.Itens
                            .OrderBy(m => m.Timestamp)
                            .Select(m => (ChatViewModel) m),
                        messages.TotalCount,
                        messages.CurrentPage,
                        messages.PageSize
                    ));
            })
            .RequireAuthorization();

            app.MapGet("/chat/notify", async (
                IHubContext<ChatHub> hub) =>
            {
                await hub.Clients.All.SendAsync("NotifyUsers", "Notificando Usuários");

                return Results.Ok();
            })
            .AllowAnonymous();

            return app;
        }
    }
}
