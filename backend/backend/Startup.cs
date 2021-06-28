using backend.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders.Physical;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;

namespace backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "backend", Version = "v1" });
            });

            services.AddSingleton<MockMessageService>();
            services.AddSignalR().AddAzureSignalR(Configuration["SignalRConnectionString"]);
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.Authority = Configuration["Auth0:Authority"];
                options.Audience = Configuration["Auth0:Audience"];
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    NameClaimType = ClaimTypes.NameIdentifier,
                };
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "backend v1"));

            app.UseCors(o => o.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader().AllowCredentials());
            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseStaticFiles();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<TestHub>("/hubs/test");
            });

            app.Use(async (context, next) =>
            {
                var safeMethods = new[] { "GET", "OPTION", "TRACE", "HEAD" };
                if (!safeMethods.Contains(context.Request.Method))
                {
                    if (context.Request.Headers.TryGetValue("X-XSRF-TOKEN", out var headerToken)
                    && context.Request.Cookies.TryGetValue("XSRF-TOKEN", out var cookieToken))
                    {
                        Console.WriteLine($"Found token in header: {headerToken}");
                        Console.WriteLine($"Found token in cookie: {cookieToken}");

                        if (!string.IsNullOrEmpty(headerToken) && cookieToken == headerToken)
                        {
                            await next();
                            return;
                        }
                    }

                    Console.WriteLine("XSRF mismatch, abort abort!");
                    context.Response.StatusCode = 400;
                    await context.Response.WriteAsync("XSRF mismatch...");
                    await context.Response.CompleteAsync();
                    return;
                }

                await next();
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });



            using var rng = new RNGCryptoServiceProvider();
            app.Run(async context =>
            {
                var cspNonceBytes = new byte[32];
                rng.GetBytes(cspNonceBytes);
                var cspNonce = WebEncoders.Base64UrlEncode(cspNonceBytes);
                var csp = Configuration["CspPolicy"].Replace("{cspNonce}", cspNonce);
                context.Response.Headers.Add("Content-Security-Policy", csp);
                context.Response.Cookies.Append("csp-nonce", cspNonce, new CookieOptions { IsEssential = true, SameSite = SameSiteMode.Strict, Secure = true });

                var csrfTokenBytes = new byte[32];
                rng.GetBytes(csrfTokenBytes);
                var csrfToken = WebEncoders.Base64UrlEncode(csrfTokenBytes);
                context.Response.Cookies.Append("XSRF-TOKEN", csrfToken, new CookieOptions { IsEssential = true, SameSite = SameSiteMode.Strict, Secure = true });

                context.Response.ContentType = "text/html";
                await context.Response.SendFileAsync(new PhysicalFileInfo(new FileInfo(Path.Combine(env.WebRootPath, "index.html"))));
                await context.Response.CompleteAsync();
            });
        }
    }
}
