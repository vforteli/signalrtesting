using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace backend
{
    public record IndexMiddlewareOptions(string CspPolicy, string IndexFileContent);

    public class IndexMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IndexMiddlewareOptions _options;

        public IndexMiddleware(RequestDelegate next, IndexMiddlewareOptions options)
        {
            _next = next;
            _options = options;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var cspNonce = WebEncoders.Base64UrlEncode(RandomNumberGenerator.GetBytes(32));
            var cspPolicy = _options.CspPolicy.Replace("{cspNonce}", cspNonce);
            context.Response.Headers.Add("Content-Security-Policy", cspPolicy);
            context.Response.Cookies.Append("csp-nonce", cspNonce, new CookieOptions { IsEssential = true, SameSite = SameSiteMode.Strict, Secure = true });

            var csrfToken = WebEncoders.Base64UrlEncode(RandomNumberGenerator.GetBytes(32));
            context.Response.Cookies.Append("XSRF-TOKEN", csrfToken, new CookieOptions { IsEssential = true, SameSite = SameSiteMode.Strict, Secure = true });

            context.Response.ContentType = "text/html";
            await context.Response.WriteAsync(_options.IndexFileContent.Replace("{{nonce}}", cspNonce));
            await context.Response.CompleteAsync();            
        }
    }

    public static class IndexMiddlewareMiddlewareExtensions
    {
        public static IApplicationBuilder UseIndex(this IApplicationBuilder builder, IndexMiddlewareOptions options) => builder.UseMiddleware<IndexMiddleware>(options);
    }
}
