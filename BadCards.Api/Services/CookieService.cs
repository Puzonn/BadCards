namespace BadCards.Api.Services;

public class CookieService
{
    private readonly string _domain;

    public readonly CookieOptions AuthCookieOption;

    public readonly CookieOptions RefreshTokenOption;

    public readonly CookieOptions MiscCookieOption;

    public CookieService(IWebHostEnvironment environment)
    {
        if (environment.IsDevelopment())
        {
            _domain = "localhost";
        }
        else
        {
            _domain = "api.puzonnsthings.pl";
        }

        AuthCookieOption = new CookieOptions()
        {
            HttpOnly = true,
            IsEssential = true,
            Secure = true,
            Path = "/",
            Domain = _domain,
            SameSite = SameSiteMode.None,
            Expires = DateTime.Now.AddDays(7)
        };

        MiscCookieOption = new CookieOptions()
        {
            HttpOnly = false,
            IsEssential = false,
            Secure = true,
            Path = "/",
            Domain = _domain,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(90)
        };

        RefreshTokenOption = new CookieOptions()
        {
            HttpOnly = true,
            IsEssential = true,
            Secure = true,
            Path = "/",
            Domain = _domain,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        };
    }
}
