using BadCards.Api.Database;
using BadCards.Api.Hubs;
using BadCards.Api.Middleware;
using BadCards.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.IdentityModel.Tokens;
using System.Text;

const string CorsName = "_allowCors";

var builder = WebApplication.CreateBuilder(args);

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

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(o =>
{
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey
        (Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = false,
        ValidateIssuerSigningKey = true
    };
    o.Events = new JwtBearerEvents()
    {
        OnMessageReceived = context =>
        {
            string? token = context.Request.Cookies["Bearer"];

            if (!string.IsNullOrEmpty(token))
            {
                context.Token = token;
            }

            return Task.CompletedTask;
        },
    };
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
app.UseMiddleware(typeof(JWTMiddleware));

app.MapHub<RoomHub>("/services/roomHub");

app.MapControllers();

app.Run();