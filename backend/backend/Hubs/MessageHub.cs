using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace backend.Hubs
{
    [Authorize]
    public class MessageHub : Hub<IMessageHub>
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
            return Clients.All.BroadcastMessage(item);
        }

        public Task AckMessage(Guid messageId)
        {
            // this should remove the message from the cache
            // get list of who is waiting for ack, just use all for now
            return Clients.All.AckMessage(messageId);
        }

        public Task DeleteMessage(Guid messageId)
        {
            _messageService.Messages.TryRemove(messageId, out _);
            return Clients.All.DeleteMessage(messageId);
        }
    }
}
