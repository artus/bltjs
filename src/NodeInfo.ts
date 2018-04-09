import { ApiInfo } from './ApiInfo';

/**
 * NodeInfo is a class used to store information about the connected node. Its the information you get to see when you navigate to the root_node url.
 */
export class NodeInfo {
    public apiInfo: ApiInfo;
    public docs: string;
    public keyring: Array<string>;
    public public_key: string;
    public software: string;
    public version: string;

    /**
     * Copy constructor for loading a NodeInfo object from a JSON Object.
     * @param {any} jsonObject - The JSON Object that we'll extract the information from.
     * @returns {NodeInfo} The constructed NodeInfo object.
     */
    public static copyConstructor(jsonObject: any) : NodeInfo {
        let nodeInfo = new NodeInfo();

        // Extract ApiInfo
        nodeInfo.apiInfo = ApiInfo.copyConstructor(jsonObject.api.v1);
        nodeInfo.apiInfo.version = "v1";

        nodeInfo.docs = jsonObject.docs;
        nodeInfo.keyring = jsonObject.keyring;
        nodeInfo.public_key = jsonObject.public_key;
        nodeInfo.software = jsonObject.software;
        nodeInfo.version = jsonObject.version;

        return nodeInfo;
    }
}