﻿using backend.Hubs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IHubContext<MessageHub, IMessageHub> _hubContext;
        private readonly MockMessageService _messageService;


        public MessageController(IHubContext<MessageHub, IMessageHub> hubContext, MockMessageService messageService)
        {
            _hubContext = hubContext;
            _messageService = messageService;
        }


        [HttpDelete("api/messages/{messageId}")]
        public async Task<ActionResult<MessageModel>> DeleteMessage([FromRoute][Required] Guid messageId)
        {
            if (_messageService.Messages.TryRemove(messageId, out var deletedMessage))
            {
                await _hubContext.Clients.All.DeleteMessage(messageId);
                return deletedMessage;
            }

            return NotFound("Message not found");
        }


        [HttpDelete("api/messages/clear/")]
        public async Task<IActionResult> ClearMessage()
        {
            await Task.Delay(700); // simulate some lag
            _messageService.Messages.Clear();
            await _hubContext.Clients.All.ClearMessages();
            return Accepted();
        }


        [HttpGet("api/messages")]
        public ActionResult<IEnumerable<MessageModel>> GetMessages([FromQuery] DateTime? fromDate)
        {
            var messages = _messageService.Messages.Select(o => o.Value);
            if (fromDate.HasValue)
            {
                messages = messages.Where(o => o.TimeSent > fromDate);
            }

            return messages.OrderBy(o => o.TimeSent).ToList();
        }
    }
}
