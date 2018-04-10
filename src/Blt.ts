import * as driver from 'bigchaindb-driver';
import * as bip39 from 'bip39';

import { NodeInfo } from './NodeInfo';
import { BltAsset } from './BltAsset';

import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import { TestResult } from './TestResult';
import { BltMetadata } from './BltMetadata';

/**
 * Blt (BigchainDB Load Tester) is the main class which we use to execute functionality in regards to the bigchaindb node/cluster we connected to.
 */
export class Blt {

    private connection: any;
    readonly keySeed: string = "Blt";

    /**
     * Initialize a new Blt instance.
     * 
     * @constructor
     * @param {string} connection_protocol - The protocol to connect to the node. (e.g. "https")
     * @param {string} node_host - The host of the node to connect to. (e.g. "test.bigchaindb.com")
     * @param {string} [node_port = ""] - The port of the node.
     * @param {string} [api_path = "/api/v1/"] - The path to the API.
     * @param {string} [api_id = ""] - The ID of the application.
     * @param {string} [api_key = ""] - The Key of the application.
     */
    constructor(public connection_protocol: string, public node_host: string, public node_port: string = "", public api_path: string = "/api/v1/", public app_id: string = "", public app_key: string = "") {

        if (connection_protocol == undefined) throw new Error("Connection protocol is undefined.");
        if (node_host == undefined) throw new Error("Node host is undefined.");

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
     * Return the keypair that will be used by Blt to sign transactions.
     * 
     * @returns {any} The keypair generated with the Bltjs keySeed.
     */
    get bltIdentity(): any {
        return this.generateKeyPair(this.keySeed);
    }

    /**
     * Generate an Ed25519 keypair by using supplied seed.
     * 
     * @param {string} keySeed - The string to be used as seed.
     * @returns {any} The generated keypair.
     */
    generateKeyPair(keySeed: string) {
        return new driver.Ed25519Keypair(bip39.mnemonicToSeed(keySeed).slice(0, 32));
    }

    /**
     * Get the root url of the node. (e.g. https://test.bigchaindb.com)
     * 
     * @returns {string} The root url of the node.
     */
    get root_url(): string {
        return this.connection_protocol + "://" + this.node_host + ":" + this.node_port;
    }

    /**
     * Get the url of the api. (e.g. "https://test.bigchaindb.com/api/v1/")
     * @returns {string} The api url.
     */
    get api_url(): string {
        return this.root_url + this.api_path;
    }

    /**
     * Retrieve the Node information (from the node url and node api url).
     * 
     * @returns {Promise<NodeInfo>} The nodes information encapsulated in a NodeInfo object.
     */
    getNodeInformation(): Promise<NodeInfo> {

        return new Promise<NodeInfo>((resolve, reject) => {

            axios.get(this.root_url).then(response => {

                let returnedNodeInfo = NodeInfo.copyConstructor(response.data);
                resolve(returnedNodeInfo);
            }).catch(error => {
                reject(new Error(error));
            })

        });
    }

    /**
     * Send a supplied amount of CREATE transactions to the BigchainDB node.
     * 
     * @param {string} testId - The ID or name of the test.
     * @param {number} [amount = 100] - The amount of transactions to be posted to the BigchainDB network.
     */
    testCreateTransactions(testId: string, amount: number = 100, onTransactionIssued : any = () => {}): Promise<TestResult> {

        let startTime = new Date();

        let transactions = new Array();
        let transactionPromises = new Array();

        for (let transactionIndex = 0; transactionIndex < amount; transactionIndex++) {
            let newTransaction = this.generateCreateTransaction(testId, transactionIndex);
            transactions.push(newTransaction);
            transactionPromises.push(this.connection.postTransactionCommit(newTransaction));
            onTransactionIssued(testId, newTransaction, transactionIndex);
        }

        return new Promise<TestResult>((resolve, reject) => {

            Promise.all(transactionPromises).then(responses => {

                let endTime = new Date();
                let newTestResult = new TestResult(testId, transactions, responses, startTime, endTime);

                resolve(newTestResult);
            }).catch(error => {
                reject(error);
            });

        });
    }

    /**
     * Create a chain of a supplied amount of TRANSFER transactions.
     * 
     * @param {string} testId - The ID or name of the test.
     * @param {number} [amount = 100] - The amount of transactions to be issued.
     */
    testTransferTransactions(testId: string, amount: number = 100, onTransactionIssued : any = () => {}): Promise<TestResult> {

        let startTime = new Date();
        let transactions = new Array();
        let responses = new Array();
        let transactionIndex = 0;

        let newCreateTransaction = this.generateCreateTransaction(testId);
        transactions.push(newCreateTransaction);

        return this.connection.postTransactionCommit(newCreateTransaction).then(response => {
            onTransactionIssued(testId, newCreateTransaction, transactionIndex);
            responses.push(response);
            return this.connection.getTransaction(response.id);
        }).then(latestTransaction => {
            return this.issueTransferTransactionRecursively(testId, latestTransaction, amount, ++transactionIndex, transactions, responses, startTime, onTransactionIssued);
        });
    }

    /**
     * Chain TRANSER transactions recusrively, because loops don't play nice with promises.
     */
    issueTransferTransactionRecursively(testId : string, previousTransaction : any, amount: number, transactionIndex : number, transactions : Array<any>, responses : Array<any>, startTime : Date, onTransactionIssued: any = () => {}) : Promise<TestResult> {

        // Check if we've reached the amount of transactions we wanted.
        if (transactionIndex === amount) {
            return new Promise<TestResult>((resolve, reject) => {
                resolve(new TestResult(testId, transactions, responses, startTime, new Date()));
            });
        }

        let newTransaction = this.generateTransferTransaction(testId, previousTransaction, transactionIndex);
        transactions.push(newTransaction);
        return this.connection.postTransactionCommit(newTransaction).then(response => {
            onTransactionIssued(testId, newTransaction, transactionIndex);
            responses.push(response);
            return this.connection.getTransaction(response.id);
        }).then(latestTransaction => {
            return this.issueTransferTransactionRecursively(testId, latestTransaction, amount, ++transactionIndex, transactions, responses, startTime, onTransactionIssued);
        });
    }

    /**
     * Create a CREATE transaction with a new BltAsset as asset.
     * 
     * @returns {any} The newly created CREATE transaction.
     */
    generateCreateTransaction(testId: string, transactionIndex: number = 0): any {

        const newTransaction = driver.Transaction.makeCreateTransaction(
            new BltAsset(testId, transactionIndex),
            null,
            [driver.Transaction.makeOutput(
                driver.Transaction.makeEd25519Condition(this.generateKeyPair(testId).publicKey))
            ],
            this.generateKeyPair(testId).publicKey
        );

        return driver.Transaction.signTransaction(newTransaction, this.generateKeyPair(testId).privateKey);
    }

    /**
     * Create a TRANSFER transaction for a certain BltAsset with supplied ID.
     * 
     * @returns {any} the newly created TRANSFER transaction.
     */
    generateTransferTransaction(testId : string, previousTransaction: any, transferTransactionIndex : number = 0): any {

        const newTransferTransaction = driver.Transaction.makeTransferTransaction(
            [{ tx: previousTransaction, output_index: 0 }],
            [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(this.generateKeyPair(testId).publicKey))],
            new BltMetadata(transferTransactionIndex)
        );

        return driver.Transaction.signTransaction(newTransferTransaction, this.generateKeyPair(testId).privateKey);
    }

}