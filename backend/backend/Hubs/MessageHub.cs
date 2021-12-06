using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
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

        public Task AckMessages(IEnumerable<Guid> messageIds)
        {
            // this should of course only remove messages for the one who acked them           
            foreach (var messageId in messageIds)
            {
                _messageService.Messages.TryRemove(messageId, out _);
            }

            // oh this should go to the sender of the message...
            return Clients.Others.AckMessages(new AckMessagesModel(Context?.User?.Identity?.Name!, messageIds));
        }

        public Task DeleteMessage(Guid messageId)
        {
            _messageService.Messages.TryRemove(messageId, out _);
            return Clients.All.DeleteMessage(messageId);
        }

        public Task IndicateTyping(Guid chatId)
        {
            // todo this should use some id
            // todo this should send to others in group based on chat id
            var model = new IndicateTypingModel(Context?.User?.Identity?.Name!, chatId, true);
            return Clients.Others.IndicateTyping(model);
        }

        public async Task<MessageModel> SendMessage(SendMessageModel model)
        {
            var message = new MessageModel(Context?.User?.Identity?.Name!, model.ChatId, Guid.NewGuid(), model.Message, DateTime.UtcNow);
            _messageService.Messages.TryAdd(message.MessageId, message);
            await Clients.Others.BroadcastMessage(message);

            return message;
        }
    }
}
