using System;

namespace backend.Models
{
    public record MessageModel(
     string Name,
     Guid MessageId,
     string Message,
     DateTime TimeSent);
}
