using System.Net.NetworkInformation;

namespace BadCards.Api.Models;

public class StaticCookiesOptions
{
    private static readonly string _Domain;

    public readonly static CookieOptions AuthCookieOption = new CookieOptions()
    {
        HttpOnly = true,
        IsEssential = true,
        Secure = true,
        Path = "/",
        SameSite = SameSiteMode.None,
        Domain = _Domain,
        Expires = DateTime.Now.AddDays(7)
    };

    public readonly static CookieOptions RefreshTokenOption = new CookieOptions()
    {
        HttpOnly = true,
        IsEssential = true,
        Secure = true,
        Path = "/",
        SameSite = SameSiteMode.None,
        Domain = _Domain,
        Expires = DateTime.UtcNow.AddDays(7)
    };

    public readonly static CookieOptions MiscCookieOption = new CookieOptions()
    {
        HttpOnly = false,
        IsEssential = false,
        Secure = true,
        Path = "/",
        SameSite = SameSiteMode.None,
        Domain = _Domain,
        Expires = DateTime.UtcNow.AddDays(90)
    };

    static StaticCookiesOptions()
    {
#if DEBUG
        _Domain = "localhost";
#else
         _Domain = "puzonnsthings.pl";
#endif
    }
}