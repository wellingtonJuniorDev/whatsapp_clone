using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Whatsapp.Clone.Entities
{
    public class ChatMessage
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.String)]
        public Guid Id { get; set; }
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        public string Message { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local, Representation = BsonType.DateTime)]
        public DateTime Timestamp { get; set; }

        public string Relation { get; private set; }

        public ChatMessage(string senderId, string receiverId, string message)
        {
            Id = Guid.NewGuid();
            SenderId = senderId;
            ReceiverId = receiverId;
            Message = message;
            Timestamp = DateTime.Now;
            Relation = GetRelation();
        }

        private string GetRelation() => MakeRelation(SenderId, ReceiverId);

        public static string MakeRelation(string senderId, string receiverId)
        {
            if (senderId.CompareTo(receiverId) > 0)
            {
                return $"{senderId}-{receiverId}";
            }
            return $"{receiverId}-{senderId}";
        }
    }
}
