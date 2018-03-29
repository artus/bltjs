import * as driver from 'bigchaindb-driver';

/**
 * Blt (BigchainDB Load Tester) is the main class which we use to execute functionality in regards to the bigchaindb node/cluster we connected to.
 */
export class Blt {

    private connection: any;

    /**
     * Initialize a new Blt instance.
     * @constructor
     * @param {string} connection_protocol - The protocol to connect to the node. (e.g. "https")
     * @param {string} node_host - The host of the node to connect to. (e.g. "test.bigchaindb.com")
     * @param {string} [node_port = ""] - The port of the node.
     * @param {string} [api_path = "/api/v1/"] - The path to the API.
     * @param {string} [api_id = ""] - The ID of the application.
     * @param {string} [api_key = ""] - The Key of the application.
     */
    constructor(public connection_protocol : string, public node_host: string, public node_port : string = "", public api_path : string = "/api/v1/", public app_id: string = "", public app_key: string = "") {

        if (connection_protocol == undefined) throw new Error("Connection protocol is undefined.");
        if (node_host == undefined)  throw new Error("Node host is undefined.");

        if (this.app_id === "" || this.app_key === "") {
            this.connection = new driver.Connection(this.api_url);
        }
        else {
            this.connection = new driver.Connection(this.api_url, {
                app_id: this.app_id,
                app_key: this.app_key
            });
        }
    }

    /**
     * Get the root url of the node. (e.g. https://test.bigchaindb.com)
     * @returns {string} The root url of the node.
     */
    get root_url() : string {
        return this.connection_protocol + "://" + this.node_host + ":" + this.node_port;
    }

    /**
     * Get the url of the api. (e.g. "https://test.bigchaindb.com/api/v1/")
     * @returns {string} The api url.
     */
    get api_url() : string {
        return this.root_url + this.api_path;
    }

}