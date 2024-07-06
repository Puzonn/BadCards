using BadCards.Api.Models.Api.Services;
using BadCards.Api.Models.Database;

namespace BadCards.Api.Services;

public interface ICardService
{
    public Task<CardServiceResponse> FillDatabaseCards();
    public Task<CardDb> GetRandomBlackCard();
    public Task<IEnumerable<CardDb>> GetRandomWhiteCards(int count);
    public string GetCardTranslation(uint cardId, string locale);
    public int GetAnswerCount(string content); 
}