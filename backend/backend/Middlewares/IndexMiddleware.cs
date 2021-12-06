using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using System.IO;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace backend
{
    public record IndexMiddlewareOptions(string CspPolicy, string IndexFilePath);

    public class IndexMiddleware
    {
        private readonly string _cspPolicy;
        private readonly string _indexFileContent;

        public IndexMiddleware(RequestDelegate next, IndexMiddlewareOptions options)
        {
            _ = next;
            _cspPolicy = options.CspPolicy;
            _indexFileContent = File.ReadAllText(options.IndexFilePath);
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var cspNonce = WebEncoders.Base64UrlEncode(RandomNumberGenerator.GetBytes(32));
            var cspPolicy = _cspPolicy.Replace("{cspNonce}", cspNonce);
            context.Response.Headers.Add("Content-Security-Policy", cspPolicy);
            context.Response.Cookies.Append("csp-nonce", cspNonce, new CookieOptions { IsEssential = true, SameSite = SameSiteMode.Strict, Secure = true });

            var csrfToken = WebEncoders.Base64UrlEncode(RandomNumberGenerator.GetBytes(32));
            context.Response.Cookies.Append("XSRF-TOKEN", csrfToken, new CookieOptions { IsEssential = true, SameSite = SameSiteMode.Strict, Secure = true });

            context.Response.ContentType = "text/html";
            await context.Response.WriteAsync(_indexFileContent.Replace("{{nonce}}", cspNonce));
            await context.Response.CompleteAsync();
        }
    }

    public static class IndexMiddlewareMiddlewareExtensions
    {
        /// <summary>
        /// Add index middleware used for sending the index content and set csp and csrf headers.
        /// This middleware does not call next
        /// </summary>
        /// <param name="builder"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        public static IApplicationBuilder UseIndex(this IApplicationBuilder builder, IndexMiddlewareOptions options) => builder.UseMiddleware<IndexMiddleware>(options);
    }
}
