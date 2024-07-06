export const AboutTab = () => {
  return (
    <>
      <div className="container text-black mx-auto px-4">
        <h1 className="text-4xl font-bold text-center">
          How to Play Cards Against Humanity
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Objective</h2>
          <p className="mb-6">
            The objective of Cards Against Humanity is to have the most
            hilarious or outrageous card combinations and win the most rounds.
          </p>

          <h2 className="text-2xl font-bold mb-4">Setup</h2>
          <ul className="list-disc list-inside mb-6">
            <li>Each player draws 10 white cards.</li>
            <li>One player is selected to be the Judge for the first round.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">Gameplay</h2>
          <ol className="list-decimal list-inside mb-6">
            <li>The Judge draws a black card and reads it out loud.</li>
            <li>
              Everyone else answers the question or fills in the blank by
              passing one white card to the Judge, face down.
            </li>
            <li>
              The Judge shuffles all the answers and shares each card
              combination with the group.
            </li>
            <li>
              The Judge picks the funniest play, and whoever submitted it gets
              one point.
            </li>
            <li>
              After the round, a new player becomes the Judge, and everyone
              draws back up to 10 white cards.
            </li>
          </ol>

          <h2 className="text-2xl font-bold mb-4">Winning the Game</h2>
          <p className="mb-6">
            The game continues until you decide to stop. The player with the
            most points at the end wins.
          </p>

          <h2 className="text-2xl font-bold mb-4">House Rules</h2>
          <p className="mb-6">
            Feel free to make your own house rules to add more fun or twists to
            the game!
          </p>
        </div>
      </div>
    </>
  );
};
