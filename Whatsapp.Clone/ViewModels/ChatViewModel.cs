using Whatsapp.Clone.Entities;

namespace Whatsapp.Clone.ViewModels
{
    internal record ChatViewModel(
        Guid Id,
        string SenderId,
        string ReceiverId,
        string Message,
        string Date,
        string Time
    )
    {
        public static explicit operator ChatViewModel(ChatMessage chatMessage)
        {
            if (chatMessage is null) return null;

            return new ChatViewModel(
                chatMessage.Id,
                chatMessage.SenderId,
                chatMessage.ReceiverId,
                chatMessage.Message,
                chatMessage.Timestamp.ToShortDateString(),
                chatMessage.Timestamp.ToShortTimeString()
            );
        }
    }
}
