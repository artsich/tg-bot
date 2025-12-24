namespace TgBot.Admin.Api.Api.Validation;

public static class ValidationExtensions
{
	public static RouteHandlerBuilder WithFluentValidation<T>(this RouteHandlerBuilder builder) where T : class =>
		builder.AddEndpointFilter<FluentValidationFilter<T>>();
}


