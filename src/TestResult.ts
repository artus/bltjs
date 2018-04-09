/**
 * A TestResult is a class used to store information about a performed load test.
 */
export class TestResult {

    testId : string;
    transactions : Array<any>;

    responses : Array<any>;

    startTime : Date;
    endTime : Date;

    /**
     * Initialize a new TestResult.
     * @constructor
     * 
     * @param {string} testId - The ID of the new test.
     * @param {Array<any>} transactions - The array of transactions.
     * @param {Array<any>} responses - The array of responses from the BigchainDB node.
     * @param {Date} startTime - Timestamp at the start of the test.
     * @param {Date} endTime - Timestamp of end of test.
     */
    constructor(testId : string, transactions : Array<any>, responses : Array<any>, startTime : Date, endTime : Date) {
        this.testId = testId;
        this.transactions = transactions;
        this.responses = responses;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    get transactionCount() : number {
        return this.transactions.length;
    }
}