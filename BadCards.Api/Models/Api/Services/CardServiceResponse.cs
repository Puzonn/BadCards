namespace BadCards.Api.Models.Api.Services;

public class CardServiceResponse
{
    public bool Success { get; set; }   
    public string? Error { get; set; }

    public CardServiceResponse(bool success, string error = "") 
    {
        Success = success;
        Error = error;
    }
}