// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract TableState is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    // The offchain `data` returned by Chainlink from the Tableland network
    uint256 public data;
    // URL to make an HTTP request to
    string public url;
    // HTTP response path that must lead to a single `uint256`
    string public path;
    // Chainlink job ID (in this case, for getting a single word as `uint256`)
    bytes32 private _jobId;
    // Chainlink network fee
    uint256 private _fee;

    // Emit upon a new request
    event RequestData(bytes32 indexed requestId, uint256 data);

    /**
     * @dev Initialize the link token and target oracle
     *
     * Goerli Testnet details:
     * Link Token: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     * Oracle: 0x188b71C9d27cDeE01B9b0dfF5C1aff62E8D6F434 (Translucent) or 0xCC79157eb46F5624204f47AB42b3906cAA40eaB7 (Chainlink DevRel)
     * _jobId: 7599d3c8f31e4ce78ad2b790cbcfc673 (Translucent) or ca98366cc7314957b8c012c72f05aeeb (Chainlink DevRel)
     *
     */
    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        setChainlinkOracle(0x188b71C9d27cDeE01B9b0dfF5C1aff62E8D6F434);
        _jobId = "7599d3c8f31e4ce78ad2b790cbcfc673";
        _fee = (1 * LINK_DIVISIBILITY) / 10;
    }

    /**
     * @dev Set the `url` to some HTTPS URL
     */
    function setRequestUrl(string memory _url) external onlyOwner {
        url = _url;
    }

    /**
     * @dev Set the `path` to a single word response that maps to a `uint256`
     */
    function setRequestPath(string memory _path) external onlyOwner {
        path = _path;
    }

    /**
     * @dev Set the Oracle to make the offchain request
     */
    function setOracle(address oracle) external onlyOwner {
        setChainlinkOracle(oracle);
    }

    /**
     * @dev Set the `_jobId`
     */
    function setJobId(bytes32 jobId) external onlyOwner {
        _jobId = jobId;
    }

    /**
     * @dev Set the Chainlink `fee`
     */
    function setFee(uint256 fee) external onlyOwner {
        _fee = fee;
    }

    /**
     * @dev Create a Chainlink request to retrieve API response
     */
    function requestData() public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.fulfill.selector
        );
        // Set the URL to perform the GET request on
        req.add("get", url);
        // Set the path to find the desired data in the API response
        req.add("path", path);
        // Required parameter, set to `1` to denote no multiplication needed in return value
        req.addInt("multiply", 1);
        // Sends the request
        requestId = sendChainlinkRequest(req, _fee);
    }

    /**
     * @dev Receive the response in the form of `uint256`
     */
    function fulfill(
        bytes32 _requestId,
        uint256 _data
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestData(_requestId, _data);
        data = _data;
    }

    /**
     * @dev Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
