using System;
using System.Threading.Tasks;

namespace backend.Models;

public interface IMessageHub
{
    Task BroadcastMessage(MessageModel message);

    Task AckMessage(Guid messageId, string userId);

    Task DeleteMessage(Guid messageId);

    Task IndicateTyping(Guid chatId, string userId);
}
