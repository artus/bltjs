/**
 * A BltAsset is the asset that get's stored on the BigchainDB network when Blt.js issues a CREATE transaction. Assets posted on a BigchainDB network are stored forever. 
 * By creating a specific structure for an asset created by Blt.js we can create a filter to ingore these in a production environment.
 */
export class BltAsset {

    readonly name: string = "BltAsset";
    readonly date: Date = new Date();

    /**
     * Initialize a new BltAsset.
     * @constructor
     * 
     * @param {string} testId - The ID of the test.
     * @param {number} [transactionIndex = 0] - The index of this transaction relative to all other transactions that are generated with this load-testing operation.
     */
    constructor(public readonly testId : string, public transactionIndex : number = 0) {
        // Do nothing
    }

}