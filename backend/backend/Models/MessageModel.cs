using System;
using System.Collections.Generic;

namespace backend.Models
{
    public record MessageModel(
        string UserId,
        Guid ChatId,
        Guid MessageId,
        string Message,
        DateTime TimeSent);

    public record IndicateTypingModel(
        string UserId,
        Guid ChatId,
        bool Typing);

    public record AckMessagesModel(
        string UserId,
        IEnumerable<Guid> MessageIds);
}
