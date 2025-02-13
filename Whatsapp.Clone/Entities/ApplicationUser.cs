using Microsoft.AspNetCore.Identity;

namespace Whatsapp.Clone.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
    }
}
