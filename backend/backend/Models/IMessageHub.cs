using System;
using System.Threading.Tasks;

namespace backend.Models;

public interface IMessageHub
{
    Task BroadcastMessage(MessageModel message);
    Task AckMessage(Guid messageId);
    Task DeleteMessage(Guid messageId);
    Task IndicateTyping(Guid chatId, string username);
}
