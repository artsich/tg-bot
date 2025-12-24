using FluentValidation;

namespace TgBot.Admin.Api.Api.Validation;

public sealed class FluentValidationFilter<T> : IEndpointFilter where T : class
{
	public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
	{
		var model = context.Arguments.OfType<T>().FirstOrDefault();
		if (model is null)
			return await next(context);

		var validator = context.HttpContext.RequestServices.GetService<IValidator<T>>();
		if (validator is null)
			return await next(context);

		var result = await validator.ValidateAsync(model, context.HttpContext.RequestAborted);
		if (result.IsValid)
			return await next(context);

		var errors = result.Errors
			.GroupBy(e => e.PropertyName)
			.ToDictionary(
				g => g.Key,
				g => g.Select(e => e.ErrorMessage).ToArray()
			);

		return Results.ValidationProblem(errors);
	}
}


