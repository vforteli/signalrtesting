using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace backend.Hubs
{
    [Authorize]
    public class MessageHub : Hub
    {
        private readonly MockMessageService _messageService;

        public MessageHub(MockMessageService messageService)
        {
            _messageService = messageService;
        }

        public Task BroadcastMessage(string message)
        {
            var item = new MessageModel(Context?.User?.Identity?.Name!, Guid.NewGuid(), message, DateTime.UtcNow);

            _messageService.Messages.TryAdd(item.MessageId, item);
            return Clients.All.SendAsync("broadcastMessage", item);
        }

        public Task DeleteMessage(Guid messageId)
        {
            _messageService.Messages.TryRemove(messageId, out _);
            return Clients.All.SendAsync("deleteMessage", messageId);
        }
    }
}
