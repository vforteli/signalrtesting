using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HeadersController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetHeaders()
        {
            var headers = HttpContext.Request.Headers;
            return Ok(headers);
        }
    }
}
