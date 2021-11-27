using backend.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders.Physical;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.IO;
using System.Security.Claims;
using System.Security.Cryptography;

namespace backend;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddCors();
        builder.Services.AddControllers();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SchemaFilter<NullableSchemaFilter>();
            c.SupportNonNullableReferenceTypes();
            c.UseAllOfToExtendReferenceSchemas();
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "backend", Version = "v1" });
        });

        builder.Services.AddSingleton<MockMessageService>();
        builder.Services.AddSignalR().AddAzureSignalR(builder.Configuration["SignalRConnectionString"]);
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.Authority = builder.Configuration["Auth0:Authority"];
            options.Audience = builder.Configuration["Auth0:Audience"];
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = true,
                NameClaimType = ClaimTypes.NameIdentifier,
            };
        });

        var app = builder.Build();

        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "backend v1"));

        app.UseCors(o => o.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader().AllowCredentials());
        app.UseHttpsRedirection();

        app.UseRouting();

        app.UseAuthentication();

        app.UseAuthorization();

        app.UseStaticFiles();
        app.UseCsrfValidationMiddleware();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapHub<TestHub>("/hubs/test");
        });


        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });

        app.Run(async context =>
        {
            var cspNonce = WebEncoders.Base64UrlEncode(RandomNumberGenerator.GetBytes(32));
            var csp = builder.Configuration["CspPolicy"].Replace("{cspNonce}", cspNonce);
            context.Response.Headers.Add("Content-Security-Policy", csp);
            context.Response.Cookies.Append("csp-nonce", cspNonce, new CookieOptions { IsEssential = true, SameSite = SameSiteMode.Strict, Secure = true });

            var csrfToken = WebEncoders.Base64UrlEncode(RandomNumberGenerator.GetBytes(32));
            context.Response.Cookies.Append("XSRF-TOKEN", csrfToken, new CookieOptions { IsEssential = true, SameSite = SameSiteMode.Strict, Secure = true });

            context.Response.ContentType = "text/html";
            await context.Response.SendFileAsync(new PhysicalFileInfo(new FileInfo(Path.Combine(builder.Environment.WebRootPath, "index.html"))));
            await context.Response.CompleteAsync();
        });

        app.Run();
    }
}
