using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;

namespace backend
{
    public class CsrfValidationMiddleware
    {
        private static readonly HashSet<string> SafeMethods = new() { "GET", "OPTION", "TRACE", "HEAD" };
        private readonly RequestDelegate _next;

        public CsrfValidationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (!SafeMethods.Contains(context.Request.Method))
            {
                if (context.Request.Headers.TryGetValue("X-XSRF-TOKEN", out var headerToken)
                && context.Request.Cookies.TryGetValue("XSRF-TOKEN", out var cookieToken))
                {
                    Trace.WriteLine($"Found token in header: {headerToken}");
                    Trace.WriteLine($"Found token in cookie: {cookieToken}");

                    if (!string.IsNullOrEmpty(headerToken) && cookieToken == headerToken)
                    {
                        await _next(context);
                        return;
                    }
                }

                Trace.WriteLine("CSRF mismatch, abort abort!");
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("CSRF mismatch...");
                await context.Response.CompleteAsync();
                return;
            }

            await _next(context);
        }
    }

    public static class CsrfValidationMiddlewareExtensions
    {
        public static IApplicationBuilder UseCsrfValidationMiddleware(this IApplicationBuilder builder) => builder.UseMiddleware<CsrfValidationMiddleware>();
    }
}
