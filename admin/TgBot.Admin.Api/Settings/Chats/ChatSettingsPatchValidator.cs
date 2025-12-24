using FluentValidation;
using TgBot.Admin.Api.Api.Contracts;

namespace TgBot.Admin.Api.Settings.Chats;

public sealed class ChatSettingsPutValidator : AbstractValidator<ChatSettingsPut>
{
	public ChatSettingsPutValidator()
	{
		RuleFor(x => x.JokeTopic)
			.MaximumLength(512);
	}
}


