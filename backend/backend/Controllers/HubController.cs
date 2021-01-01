using backend.Hubs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    public class HubController : ControllerBase
    {
        private readonly IHubContext<TestHub> _hubContext;
        private readonly MockMessageService _messageService;


        public HubController(IHubContext<TestHub> hubContext, MockMessageService messageService)
        {
            _hubContext = hubContext;
            _messageService = messageService;
        }



        [HttpPost("api/messages")]
        public async Task<IActionResult> PostMessage([FromBody] SendMessageModel model)
        {
            var item = new MessageModel(HttpContext?.User?.Identity?.Name!, Guid.NewGuid(), model.Message, DateTime.UtcNow);
            _messageService.Messages.TryAdd(item.MessageId, item);
            await _hubContext.Clients.All.SendAsync("broadcastMessage", item);

            return Accepted(item);
        }


        [HttpDelete("api/messages/{messageId}")]
        public async Task<IActionResult> DeleteMessage([FromRoute] Guid messageId)
        {
            if (_messageService.Messages.TryRemove(messageId, out var deletedMessage))
            {
                await _hubContext.Clients.All.SendAsync("deleteMessage", messageId);
                return Accepted(deletedMessage);
            }

            return BadRequest("Message not found");
        }


        [HttpDelete("api/messages/clear/")]
        public async Task<IActionResult> ClearMessage()
        {
            await Task.Delay(700); // simulate some lag
            _messageService.Messages.Clear();
            await _hubContext.Clients.All.SendAsync("clearMessages");

            return Accepted();
        }

        [HttpGet("api/messages")]
        public ActionResult<IEnumerable<MessageModel>> Messages() =>
            _messageService.Messages.Select(o => o.Value).OrderBy(o => o.TimeSent).ToList();
    }
}
