namespace TgChat.Admin.Api.Api;

public sealed record ApiResponse<T>(
	bool Success,
	T Data,
	string? Message = null
);


