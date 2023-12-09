namespace BadCards.Api.Models.Hub;

[Serializable]
public class SelectedCard : Card
{
    public required string SelectedByUsername { get; set; }
    public required bool IsSelectedByJudge { get; set; }
    public required bool IsOwner { get; set; }  

    public SelectedCard(string content) : base(0, false, content, 0)
    {

    }
}