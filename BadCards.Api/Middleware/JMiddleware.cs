namespace BadCards.Api.Middleware;

public class JMiddleware
{
    private readonly RequestDelegate _next;

    public JMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        await _next(context);
    }
}