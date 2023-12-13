namespace BadCards.Api.Models;

public class StaticCookiesOptions
{
    public readonly static CookieOptions AuthCookieOption = new CookieOptions()
    {
        HttpOnly = true,
        IsEssential = true,
        Secure = true,
        Path = "/",
        SameSite = SameSiteMode.None,
        Domain = "localhost",
        Expires = DateTime.Now.AddDays(7)
    };

    public readonly static CookieOptions RefreshTokenOption = new CookieOptions()
    {
        HttpOnly = true,
        IsEssential = true,
        Secure = true,
        Path = "/",
        SameSite = SameSiteMode.None,
        Domain = "localhost",
        Expires = DateTime.UtcNow.AddDays(7)
    };

    public readonly static CookieOptions MiscCookieOption = new CookieOptions()
    {
        HttpOnly = false,
        IsEssential = false,
        Secure = true,
        Path = "/",
        SameSite = SameSiteMode.None,
        Domain = "localhost",
        Expires = DateTime.UtcNow.AddDays(90)
    };
}