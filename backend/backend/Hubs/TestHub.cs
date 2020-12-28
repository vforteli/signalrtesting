using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace backend.Hubs
{
    public record MessageModel(
        string Name,
        Guid MessageId,
        string Message,
        DateTime TimeSent);


    [Authorize]
    public class TestHub : Hub
    {
        private readonly MockMessageService _messageService;

        public TestHub(MockMessageService messageService)
        {
            _messageService = messageService;
        }

        public Task BroadcastMessage(string message)
        {
            var item = new MessageModel(Context?.User?.Identity?.Name!, Guid.NewGuid(), message, DateTime.UtcNow);

            _messageService.Messages.TryAdd(item.MessageId, item);

            // todo maybe send to all except caller            
            return Clients.All.SendAsync("broadcastMessage", item);
        }

        public Task DeleteMessage(Guid messageId)
        {
            _messageService.Messages.TryRemove(messageId, out _);
            return Clients.All.SendAsync("deleteMessage", messageId);
        }
    }
}
