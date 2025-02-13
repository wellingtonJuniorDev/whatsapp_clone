namespace Whatsapp.Clone.ViewModels
{
    internal record UserTokenViewModel(string Id, string Email, string Name, string AccessToken);

    internal record LoginResponseViewModel(double ExpiresIn, UserTokenViewModel User)
    {
        internal void Deconstruct(out string id, out string name, out string email)
        {
            id = User.Id;
            name = User.Name;
            email = User.Email;
        }
    }
}
