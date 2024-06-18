using System.Text.Json.Serialization;

namespace BadCards.Api.Models.Hub;

public class Card
{
    public uint OwnerId { get; set; }
    public uint CardId { get; set; }
    public bool IsBlack { get; set; }
    public string Content { get; set; }
    public string OwnerUsername { get; set; }

    [JsonIgnore]
    public bool IsEmpty { get; set; } = false;

    public Card(uint cardId, bool isBlack, string content,  uint ownerId)
    {
        CardId = cardId;
        IsBlack = isBlack;
        IsEmpty = false;
        Content = content;
        OwnerId = ownerId;  
    }

    [JsonIgnore]
    public static readonly Card Empty = new Card(0, false, string.Empty, 0)
    {
        IsEmpty = true,
    };
}