using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Whatsapp.Clone.Data;
using Whatsapp.Clone.Entities;

namespace Whatsapp.Clone.Configurations
{
    public static class IdentityExtensions
    {
        public static IServiceCollection AddIdentityConfiguration(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services
                .AddDbContext<ApplicationDbContext>(options =>
                   options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
                );

            services.AddDefaultIdentity<ApplicationUser>(options =>
            {
                options.User.RequireUniqueEmail = true;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>();

            //JWT
            var jwtConfiguration = configuration.GetSection(nameof(JwtConfiguration));
            services.Configure<JwtConfiguration>(jwtConfiguration);

            var appSettings = jwtConfiguration.Get<JwtConfiguration>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = true;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = appSettings.Issuer,
                    ValidateAudience = false
                };

               // authorization for signalR
               options.Events = new JwtBearerEvents
               {
                   OnMessageReceived = context =>
                   {
                       var accessToken = context.Request.Query["access_token"];
                       if (!string.IsNullOrEmpty(accessToken))
                       {
                           context.Token = accessToken;
                       }

                       return Task.CompletedTask;
                   }
               };
            });

            return services;
        }
    }

    public class JwtConfiguration
    {
        public string Secret { get; set; }
        public int HoursExpiration { get; set; }
        public string Issuer { get; set; }
    }
}
