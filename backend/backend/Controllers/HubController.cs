using backend.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    public class HubController : ControllerBase
    {
        private readonly IHubContext<TestHub> _hubContext;


        public HubController(IHubContext<TestHub> hubContext)
        {
            _hubContext = hubContext;
        }


        [HttpDelete("api/messages/{id}")]
        public async Task<IActionResult> DeleteMessage([FromRoute] string id)
        {
            // todo this could also delete stuff from db or whatever
            await _hubContext.Clients.All.SendAsync("deleteMessage", id);
            return Accepted();
        }
    }
}
