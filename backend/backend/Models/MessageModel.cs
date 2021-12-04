using System;

namespace backend.Models
{
    public record MessageModel(
     string UserId,
     Guid ChatId,
     Guid MessageId,
     string Message,
     DateTime TimeSent);
}
