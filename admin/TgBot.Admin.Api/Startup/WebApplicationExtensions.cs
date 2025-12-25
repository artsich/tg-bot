namespace TgBot.Admin.Api.Startup;

public static class WebApplicationExtensions
{
	public static WebApplication UseAdminApiPipeline(this WebApplication app)
	{
		app.UseCors();

		if (app.Environment.IsDevelopment())
		{
			app.UseSwagger();
			app.UseSwaggerUI();
		}

		return app;
	}
}


