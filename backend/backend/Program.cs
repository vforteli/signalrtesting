using backend.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.IO;
using System.Security.Claims;

namespace backend;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddApplicationInsightsTelemetry();
        builder.Services.AddCors();
        builder.Services.AddControllers();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SchemaFilter<NullableSchemaFilter>();
            c.SupportNonNullableReferenceTypes();
            c.UseAllOfToExtendReferenceSchemas();
            c.CustomOperationIds(o => ((ControllerActionDescriptor)o.ActionDescriptor).ActionName);
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

        if (builder.Environment.EnvironmentName != "Development")
        {
            app.UseCsrfValidationMiddleware();
        }

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapHub<MessageHub>("/hubs/test");
        });


        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });

        var frontendOptions = builder.Configuration.GetSection("FrontendOptions").GetAndValidate<FrontendOptions>();

        app.UseIndex(new IndexMiddlewareOptions(builder.Configuration["CspPolicy"], Path.Combine(builder.Environment.WebRootPath, "index.html")), frontendOptions);

        app.Run();
    }
}
