using FluentValidation;
using System.ComponentModel.DataAnnotations;

namespace Whatsapp.Clone.ViewModels
{
    internal record LoginUserViewModel([Required] string Email, [Required] string Password);
    
    internal class LoginUserViewModelValidator : AbstractValidator<LoginUserViewModel>
    {
        public LoginUserViewModelValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("O campo {PropertyName} é obrigatório")
                .EmailAddress().WithMessage("O campo {PropertyName} está com formato inválido");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("O campo {PropertyName} é obrigatório")
                .Length(6, 100).WithMessage("O campo {PropertyName} precisa ter entre {MinLength} e {MaxLength} caracteres");
        }
    }
}
