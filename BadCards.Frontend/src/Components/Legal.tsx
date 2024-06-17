import LicenseIcon from "../Assets/Icons/license_icon.jpg";

export const Legal = () => {
  return (
    <div className="legal-container m-4">
      <p>
        This work is based on content from Cards Against Humanity
        <a href="https://www.cardsagainsthumanity.com/">
          (https://www.cardsagainsthumanity.com/)
        </a>
        , and is licensed under a Creative Commons
        Attribution-NonCommercial-ShareAlike 4.0 International License.
      </p>
      <a
        rel="license"
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pl"
      >
        https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pl
      </a>
      <p>
        Attribution: Cards Against Humanity
        <a href="https://www.cardsagainsthumanity.com/">
          (https://www.cardsagainsthumanity.com/)
        </a>
        licensed under [CC BY-NC-SA 4.0]
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pl">
          https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pl
        </a>
        .
      </p>
      <img
        alt="Creative Commons License"
        style={{ width: "120px" }}
        src={LicenseIcon}
      />
    </div>
  );
};
