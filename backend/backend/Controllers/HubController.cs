using backend.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    // todo add authorize
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
        public async Task<IActionResult> PostMessage([FromBody] string message)
        {
            var item = new MessageModel(HttpContext?.User?.Identity?.Name!, Guid.NewGuid(), message, DateTime.UtcNow);  // todo this wont work before access token is sent and authenticated
            _messageService.Messages.TryAdd(item.MessageId, item);
            await _hubContext.Clients.All.SendAsync("broadcastMessage", item);

            return Accepted(item);
        }


        [HttpDelete("api/messages/{messageId}")]
        public async Task<IActionResult> DeleteMessage([FromRoute] Guid messageId)
        {
            _messageService.Messages.TryRemove(messageId, out _);
            await _hubContext.Clients.All.SendAsync("deleteMessage", messageId);

            return Accepted();
        }


        [HttpDelete("api/messages/clear/")]
        public async Task<IActionResult> ClearMessage()
        {
            _messageService.Messages.Clear();
            await _hubContext.Clients.All.SendAsync("clearMessages");

            return Accepted();
        }

        [HttpGet("api/messages")]
        public ActionResult<IEnumerable<MessageModel>> Messages() =>
            _messageService.Messages.Select(o => o.Value).OrderBy(o => o.TimeSent).ToList();
    }
}
