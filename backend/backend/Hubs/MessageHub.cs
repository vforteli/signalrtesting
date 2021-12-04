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

        public Task AckMessage(Guid messageId)
        {
            // this should remove the message from the cache
            // get list of who is waiting for ack, just use all for now
            // oh this should go to the sender of the message...
            return Clients.Others.AckMessage(messageId, Context?.User?.Identity?.Name!);
        }

        public Task DeleteMessage(Guid messageId)
        {
            _messageService.Messages.TryRemove(messageId, out _);
            return Clients.All.DeleteMessage(messageId);
        }

        [HubMethodName("indicateTyping")]
        public Task IndicateTyping(Guid chatId)
        {
            // todo this should use some id
            // todo this should send to others in group based on chat id
            return Clients.Others.IndicateTyping(chatId, Context?.User?.Identity?.Name!);
        }

        [HubMethodName("sendMessage")]
        public async Task<MessageModel> SendMessage(SendMessageModel model)
        {
            var message = new MessageModel(Context?.User?.Identity?.Name!, model.ChatId, Guid.NewGuid(), model.Message, DateTime.UtcNow);
            _messageService.Messages.TryAdd(message.MessageId, message);
            await Clients.Others.BroadcastMessage(message);

            return message;
        }
    }
}
