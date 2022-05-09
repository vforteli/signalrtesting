using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Security.Cryptography;
using System.Text.Json;
using System.Threading.Tasks;

namespace backend
{
    public record IndexMiddlewareOptions(
        string CspPolicy,
        string IndexFilePath
        );

    public record FrontendOptions
    {
        [Required(AllowEmptyStrings = false)]
        public string REACT_APP_AUTH_DOMAIN { get; init; } = "";

        [Required(AllowEmptyStrings = false)]
        public string REACT_APP_AUTH_CLIENT_ID { get; init; } = "";

        [Required(AllowEmptyStrings = false)]
        public string REACT_APP_AUTH_AUDIENCE { get; init; } = "";

        [Required(AllowEmptyStrings = false)]
        public string REACT_APP_AUTH_SCOPE { get; init; } = "";

        [Required(AllowEmptyStrings = false)]
        public string REACT_APP_SIGNALR_HUB_URL { get; init; } = "";

        public string REACT_APP_BACKEND_URL { get; init; } = "";
    }


    public class IndexMiddleware
    {
        private readonly string _cspPolicy;
        private readonly string _indexFileContent;
        private readonly FrontendOptions _frontendOptions;

        public IndexMiddleware(RequestDelegate next, IndexMiddlewareOptions options, FrontendOptions frontendOptions)
        {
            _ = next;
            _cspPolicy = options.CspPolicy;
            _indexFileContent = File.ReadAllText(options.IndexFilePath);
            _frontendOptions = frontendOptions;
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

            var content = _indexFileContent.Replace("{{nonce}}", cspNonce);

            // todo this if of course not very optimized, but here for pocing
            content = content.Replace("window._env_={}", $"window._env_ = {JsonSerializer.Serialize(_frontendOptions)}");

            await context.Response.WriteAsync(content);
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
        public static IApplicationBuilder UseIndex(this IApplicationBuilder builder, IndexMiddlewareOptions options, FrontendOptions frontendOptions) => builder.UseMiddleware<IndexMiddleware>(options, frontendOptions);
    }
}
