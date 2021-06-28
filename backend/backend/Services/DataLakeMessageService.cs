using backend.Models;
using System;
using System.Collections.Concurrent;

namespace backend.Hubs
{
    public class DataLakeMessageService
    {
        public ConcurrentDictionary<Guid, MessageModel> Messages { get; } = new ConcurrentDictionary<Guid, MessageModel>();
    }
}
