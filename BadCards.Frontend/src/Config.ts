export class Config {
    public ApiUrl: string;
    public OAuth2: string;
    public RedirectUri: string;

    public static default: Config;

    constructor() {
        if(process.env.NODE_ENV === "development"){
            this.ApiUrl = process.env.REACT_APP_DEV_API_URL as string;
            this.OAuth2 = process.env.REACT_APP_DEV_OAuth2 as string;
            this.RedirectUri = process.env.REACT_APP_DEV_REDIRECT_URI as string;
        }
        else {
            this.ApiUrl = process.env.REACT_APP_PRODUCTION_API_URL as string;
            this.OAuth2 = process.env.REACT_APP_PRODUCTION_OAuth2 as string;
            this.RedirectUri = process.env.REACT_APP_PRODUCTION_REDIRECT_URI as string;
        }
    }
}