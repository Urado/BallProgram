import { AppSettings } from "../AppSettings"

const prepareUrl = (relativeUrl: string, baseUrl: string = AppSettings.webApiUrl) => {
    return `${baseUrl}/api${relativeUrl}`;
}

function parseJSON(response: Response) {
    if (response.status === 204 || response.status === 205) {
        return null;
    }
    return response.json();
}

export const request = async (relativeUrl: string, options: RequestInit) => {
    const response = await fetch(prepareUrl(relativeUrl), options);
    console.log(response);
    return parseJSON(response);
}

export const requestGet = async (relativeUrl: string, options: RequestInit = {}) => {
    options.method = "get";
    return await request(relativeUrl, options);
}