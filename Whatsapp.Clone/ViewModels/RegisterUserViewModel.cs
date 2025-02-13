using FluentValidation;
using System.ComponentModel.DataAnnotations;

namespace Whatsapp.Clone.ViewModels
{
    internal record RegisterUserViewModel(
        [Required] string Email, 
        [Required] string Password, 
        [Required] string ConfirmPassword, 
        [Required] string Name
    );

    internal class RegisterUserViewModelValidator : AbstractValidator<RegisterUserViewModel>
    {
        public RegisterUserViewModelValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("O campo {PropertyName} é obrigatório")
                .EmailAddress().WithMessage("O campo {PropertyName} está com formato inválido");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("O campo {PropertyName} é obrigatório")
                .Length(6, 100).WithMessage("O campo {PropertyName} precisa ter entre {MinLength} e {MaxLength} caracteres");

            RuleFor(x => x.ConfirmPassword)
                .Equal(x => x.Password).WithMessage("As senhas não conferem.");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("O campo {PropertyName} é obrigatório")
                .Length(6, 100).WithMessage("O campo {PropertyName} precisa ter entre {MinLength} e {MaxLength} caracteres");
        }
    }
}
