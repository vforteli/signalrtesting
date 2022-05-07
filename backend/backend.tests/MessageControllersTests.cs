using backend.Controllers;
using backend.Hubs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Moq;
using NUnit.Framework;
using System;
using System.Threading.Tasks;

namespace backend.tests;

public class MessageControllersTests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public async Task DeleteMessageNotFound()
    {
        var mockHubContextMock = new Mock<IHubContext<MessageHub, IMessageHub>>();
        var messageServiceMock = new Mock<MockMessageService>();


        var controller = new MessageController(mockHubContextMock.Object, messageServiceMock.Object);

        var response = await controller.DeleteMessage(Guid.Empty);


        Assert.IsInstanceOf<NotFoundObjectResult>(response.Result);
    }

    [Test]
    public async Task DeleteMessageOk()
    {
        var hubContextMock = new Mock<IHubContext<MessageHub, IMessageHub>>();
        hubContextMock.Setup(o => o.Clients.All.DeleteMessage(It.IsAny<Guid>())).Verifiable();

        var mockMessageService = new MockMessageService();
        mockMessageService.Messages.TryAdd(Guid.Empty, new MessageModel("someuserid", Guid.Empty, Guid.Empty, "Some message", new DateTime(2000, 1, 1)));

        var controller = new MessageController(hubContextMock.Object, mockMessageService);


        var response = await controller.DeleteMessage(Guid.Empty);


        Assert.AreEqual(Guid.Empty, response.Value?.MessageId);

        hubContextMock.Verify();
    }
}
