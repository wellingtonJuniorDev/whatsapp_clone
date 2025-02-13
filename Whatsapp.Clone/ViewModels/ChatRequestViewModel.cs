using FluentValidation;
using System.ComponentModel.DataAnnotations;

namespace Whatsapp.Clone.ViewModels
{
    internal record ChatRequestViewModel(
      [Required] string ReceiverId,
      [Required] string Message
    );

    internal class ChatRequestViewModelValidator : AbstractValidator<ChatRequestViewModel>
    {
        public ChatRequestViewModelValidator()
        {
            RuleFor(x => x.ReceiverId)
                .NotEmpty().WithMessage("O campo {PropertyName} é obrigatório");

            RuleFor(x => x.Message)
                .NotEmpty().WithMessage("O campo {PropertyName} é obrigatório")
                .Length(1, 255).WithMessage("O campo {PropertyName} precisa ter entre {MinLength} e {MaxLength} caracteres");
        }
    }

    public record TypingMessageViewModel(string SenderId, string ReceiverId);
}
