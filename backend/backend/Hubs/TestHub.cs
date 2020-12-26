using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace backend.Hubs
{
    [Authorize]
    public class TestHub : Hub
    {
        public Task BroadcastMessage(string message)
        {
            return Clients.All.SendAsync("broadcastMessage", Context?.User?.Identity?.Name, message);
        }

        public Task DeleteMessage(string key) =>
          Clients.All.SendAsync("deleteMessage", key);

        public Task Echo(string message) =>
            Clients.Client(Context.ConnectionId).SendAsync("echo", Context?.User?.Identity?.Name, $"{message} (echo from server)");
    }
}
