import axios from "axios";
import { Config } from "./Config";

Config.default = new Config();

export default axios.create({
    baseURL: Config.default.ApiUrl+'/',
    withCredentials: true,
    validateStatus: () => true
})
