using FluentValidation;
using TgBot.Admin.Api.Api.Contracts;

namespace TgBot.Admin.Api.Settings.Global;

public sealed class GlobalSettingsPatchValidator : AbstractValidator<GlobalSettingsPatch>
{
	public GlobalSettingsPatchValidator()
	{
		When(x => x.LlmModel is not null, () =>
		{
			RuleFor(x => x.LlmModel)
				.NotEmpty()
				.Must(v => !string.IsNullOrWhiteSpace(v));
		});

		When(x => x.HistoryMaxLen is not null, () =>
		{
			RuleFor(x => x.HistoryMaxLen)
				.GreaterThan(0);
		});

		When(x => x.StupidCheck is not null, () =>
		{
			RuleFor(x => x.StupidCheck)
				.InclusiveBetween(0, 1);
		});

		When(x => x.DailyJokesTime is not null, () =>
		{
			RuleFor(x => x.DailyJokesTime)
				.Matches("^([01]\\d|2[0-3]):[0-5]\\d$");
		});

		When(x => x.AiInstructions is not null, () =>
		{
			RuleFor(x => x.AiInstructions)
				.NotEmpty()
				.Must(v => !string.IsNullOrWhiteSpace(v));
		});

		When(x => x.StupidityInstructions is not null, () =>
		{
			RuleFor(x => x.StupidityInstructions)
				.NotEmpty()
				.Must(v => !string.IsNullOrWhiteSpace(v));
		});

		When(x => x.JokeInstructions is not null, () =>
		{
			RuleFor(x => x.JokeInstructions)
				.NotEmpty()
				.Must(v => !string.IsNullOrWhiteSpace(v));
		});
	}
}


