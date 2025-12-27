# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY *.sln ./
COPY TgBot.Admin.Api/ ./TgBot.Admin.Api/
COPY TgBot.Admin.Data/ ./TgBot.Admin.Data/

RUN dotnet restore ./TgChat.Admin.sln

WORKDIR /src/TgBot.Admin.Api
RUN dotnet publish ./TgBot.Admin.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TgBot.Admin.Api.dll"]


