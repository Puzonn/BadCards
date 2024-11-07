namespace BadCards.Api.Models.Api.Cards;

public class PostCard
{
    public bool IsBlack { get; set; }
    public int AnswerCount { get; set; }
    
    public PostCardTranslation[] Translations { get; set; }
}