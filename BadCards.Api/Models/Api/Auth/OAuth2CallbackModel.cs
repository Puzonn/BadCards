namespace BadCards.Api.Models.Api.Auth;

[Serializable]
public class OAuth2CallbackModel
{
    public string Token_type { get; set; }
    public string Access_token { get; set; }
    public int Expires_in { get; set; }
}