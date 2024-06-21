using BadCards.Api.Database;
using BadCards.Api.Hubs;
using BadCards.Api.Middleware;
using BadCards.Api.Services;
using Microsoft.AspNetCore.HttpOverrides;

const string CorsName = "_allowCors";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication()
    .AddCookie("Auth", o =>
    {
        o.Cookie.Name = "auth";
        o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        o.Cookie.SameSite = SameSiteMode.Lax;
    });

builder.Services.AddSignalR();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsName, policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000", "https://puzonnsthings.pl", "https://api.puzonnsthings.pl")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddAuthorization();
builder.Services.AddDbContext<BadCardsContext>();

builder.Services.AddSingleton<CookieService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<JWTMiddleware>();
builder.Services.AddScoped<ICardService, CardService>();

var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseAuthentication();
app.UseAuthorization();

app.UseCors(CorsName);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseHsts();

app.MapHub<RoomHub>("/services/roomHub");

app.MapControllers();

app.Run();