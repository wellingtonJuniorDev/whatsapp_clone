FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
ARG API_PORT
EXPOSE ${API_PORT}

ENV TZ=America/Sao_Paulo

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Whatsapp.Clone/Whatsapp.Clone.csproj", "Whatsapp.Clone/"]
RUN dotnet restore "./Whatsapp.Clone/Whatsapp.Clone.csproj"
COPY . .
WORKDIR "/src/Whatsapp.Clone"
RUN dotnet build "./Whatsapp.Clone.csproj" -c $BUILD_CONFIGURATION -o /app/build


FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Whatsapp.Clone.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false


FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Whatsapp.Clone.dll"]