using FluentValidation;
using TgChat.Admin.Api.Api.Contracts;

namespace TgChat.Admin.Api.Settings.Chats;

public sealed class ChatSettingsPutValidator : AbstractValidator<ChatSettingsPut>
{
	public ChatSettingsPutValidator()
	{
		RuleFor(x => x.JokeTopic)
			.MaximumLength(512);
	}
}


