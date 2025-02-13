using Microsoft.AspNetCore.SignalR;
using Whatsapp.Clone.ViewModels;

namespace Whatsapp.Clone.Hubs
{
    public class ChatHub : Hub
    {
        public async Task TypingUser(TypingMessageViewModel model)
        {
            await Clients
                .User(model.ReceiverId)
                .SendAsync(ChatHubEvent.TypingUser, model);
        }
    }

    public static class ChatHubEvent
    {
        public static readonly string ReceiveMessage = "ReceiveMessage";
        public static readonly string TypingUser = "TypingUser";
        public static readonly string RegisterUser = "RegisterUser";
    }
}
