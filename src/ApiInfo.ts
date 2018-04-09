/**
 * ApiInfo is used to store information about the API of the connected node. It's what you get when you navigate to the api_url.
 */
export class ApiInfo {
    public version : string;
    public assets : string;
    public docs : string;
    public statuses : string;
    public streams : string;
    public transactions : string;

    /**
     * Create a new ApiInfo object from a JSON Object.
     * @param {any} jsonObject - The JSON Object we will extract information from.
     * @returnes {ApiInfo} The constructed ApiInfo object.
     */
    public static copyConstructor(jsonObject : any) : ApiInfo {
        let newApiInfo = new ApiInfo();

        newApiInfo.assets = jsonObject.assets;
        newApiInfo.docs = jsonObject.docs;
        newApiInfo.statuses = jsonObject.statuses;
        newApiInfo.streams = jsonObject.streams;
        newApiInfo.transactions = jsonObject.transactions;

        return newApiInfo;
    }
}