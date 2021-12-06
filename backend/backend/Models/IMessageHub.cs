using System;
using System.Threading.Tasks;

namespace backend.Models;

public interface IMessageHub
{
    Task BroadcastMessage(MessageModel message);

    Task AckMessages(AckMessagesModel model);

    Task DeleteMessage(Guid messageId);

    Task IndicateTyping(IndicateTypingModel model);
}
