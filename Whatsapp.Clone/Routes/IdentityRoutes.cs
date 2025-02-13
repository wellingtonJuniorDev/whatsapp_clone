using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Whatsapp.Clone.Configurations;
using Whatsapp.Clone.Entities;
using Whatsapp.Clone.Hubs;
using Whatsapp.Clone.ViewModels;

namespace Whatsapp.Clone.Routes
{
    public static class IdentityRoutes
    {
        public static WebApplication RegisterIdentityRoutes(this WebApplication app)
        {
            app.MapPost("/sign-up", async (
                RegisterUserViewModel viewModel,
                UserManager<ApplicationUser> userManager,
                SignInManager<ApplicationUser> signInManager,
                HttpContext httpContext,
                IOptions<JwtConfiguration> appSettings,
                IHubContext<ChatHub> hub) =>
            {
                var modelValidation = new RegisterUserViewModelValidator().Validate(viewModel);
                if (!modelValidation.IsValid)
                {
                    return Results.BadRequest(
                        new BadRequestViewModel(modelValidation.Errors.Select(validation => validation.ErrorMessage))
                    );
                }

                var user = new ApplicationUser
                {
                    UserName = viewModel.Email,
                    Email = viewModel.Email,
                    Name = viewModel.Name,
                    EmailConfirmed = true,
                    LockoutEnabled = false,
                };

                var result = await userManager.CreateAsync(user, viewModel.Password);
                if (result.Succeeded)
                {
                    await signInManager.SignInAsync(user, false);
                    var newUser = GerarJwt(user, appSettings.Value);

                    var (id, name, email) = newUser;

                    await hub.Clients
                        .AllExcept(id)
                        .SendAsync(
                            ChatHubEvent.RegisterUser, 
                            new UserChatViewModel(id, name, email, null, null)
                        );

                    return Results.Ok(newUser);
                }

                var errors = result.Errors.Select(error => error.Description);
                return Results.BadRequest(new BadRequestViewModel(errors));
            })
            .AllowAnonymous();

            app.MapPost("/sign-in", async (
                LoginUserViewModel viewModel,
                SignInManager<ApplicationUser> signInManager,
                UserManager<ApplicationUser> userManager,
                IOptions<JwtConfiguration> appSettings) =>
            {
                var modelValidation = new LoginUserViewModelValidator().Validate(viewModel);
                if (!modelValidation.IsValid)
                {
                    return Results.BadRequest(
                        new BadRequestViewModel(modelValidation.Errors.Select(validation => validation.ErrorMessage))
                    );
                }

                var result = await signInManager.PasswordSignInAsync(viewModel.Email, viewModel.Password, false, false);
                if (result.Succeeded)
                {
                    var user = await userManager.FindByEmailAsync(viewModel.Email);
                    return Results.Ok(GerarJwt(user, appSettings.Value));
                }

                return Results.BadRequest(new BadRequestViewModel(["Usuário ou Senha incorretos"]));
            })
            .AllowAnonymous();

            static LoginResponseViewModel GerarJwt(ApplicationUser user, JwtConfiguration appSettings)
            {
                var claims = new List<Claim>
                {
                    new(ClaimTypes.Name, user.Name),
                    new(JwtRegisteredClaimNames.Sub, user.Id),
                    new(JwtRegisteredClaimNames.Email, user.Email),
                    new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new(JwtRegisteredClaimNames.Nbf, ToUnixEpochDate(DateTime.UtcNow).ToString()),
                    new(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(DateTime.UtcNow).ToString(), ClaimValueTypes.Integer64)
                };

                var identityClaims = new ClaimsIdentity();
                identityClaims.AddClaims(claims);

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(appSettings.Secret);

                var token = tokenHandler.CreateToken(new SecurityTokenDescriptor
                {
                    Issuer = appSettings.Issuer,
                    Subject = identityClaims,
                    Expires = DateTime.UtcNow.AddHours(appSettings.HoursExpiration),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                });

                var encodedToken = tokenHandler.WriteToken(token);

                var userViewModel = new UserTokenViewModel(user.Id, user.Email, user.Name, encodedToken);
                var response = new LoginResponseViewModel( 
                    TimeSpan.FromHours(appSettings.HoursExpiration).TotalSeconds,
                    userViewModel
                );
                return response;
            }

            static long ToUnixEpochDate(DateTime date)
                => (long)Math.Round((date.ToUniversalTime() - DateTimeOffset.UnixEpoch).TotalSeconds);

            return app;
        }
    }
}
