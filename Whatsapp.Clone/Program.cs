using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using Whatsapp.Clone.Configurations;
using Whatsapp.Clone.Data;
using Whatsapp.Clone.Hubs;
using Whatsapp.Clone.Routes;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = configuration
        .GetSection("Cultures")
        .Get<string[]>();

    options.SetDefaultCulture(supportedCultures[0])
        .AddSupportedCultures(supportedCultures)
        .AddSupportedUICultures(supportedCultures);

    options.ApplyCurrentCultureToResponseHeaders = true;
});

builder.Services.AddIdentityConfiguration(configuration);
builder.Services.AddDbContext<ChatDbContext>(options =>
{
    options.UseMongoDB(
        configuration.GetConnectionString("ChatConnection"),
        configuration["ChatDb"]
    );
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var corsOrigins = configuration
            .GetSection("CorsOrigins")
            .Get<string[]>();

        policy
            .WithOrigins(corsOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var redisConnectionString = configuration.GetConnectionString("BackplaneConnection");

builder.Services
    .AddSignalR()
    .AddStackExchangeRedis(configuration.GetConnectionString("BackplaneConnection"), options =>
    {
        options.Configuration.ChannelPrefix = RedisChannel.Literal(nameof(Whatsapp.Clone));
    });

builder.Services
    .AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>("PostgreSQL")
    .AddDbContextCheck<ChatDbContext>("MongoDb");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseForwardedHeaders();

app.RegisterIdentityRoutes()
   .RegisterUserRoutes()
   .RegisterChatRoutes();

app.MapGet("/instance", () => Environment.GetEnvironmentVariable("HOSTNAME"));

app.UseRequestLocalization();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks("/",
    new HealthCheckOptions
    {
        Predicate = _ => true,
        ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
    }
);

app.MapHub<ChatHub>(configuration["ChatHub"]);

using var scope = app.Services.CreateScope();
    scope.ServiceProvider
        .GetRequiredService<ApplicationDbContext>()
        .Database
        .Migrate();

app.Run();