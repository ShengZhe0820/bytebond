// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "https://github.com/hashgraph/hedera-smart-contracts/blob/main/contracts/hts-precompile/HederaResponseCodes.sol";
import "https://github.com/hashgraph/hedera-smart-contracts/blob/main/contracts/hts-precompile/HederaTokenService.sol";

interface IUniswapRouter {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

contract FundedTraderProgram is HederaTokenService {
    address public trader;
    address public funder;

    IUniswapRouter uniswapRouter;
    
    constructor(address _trader, address _uniswapRouterAddress) {
        funder = msg.sender;
        trader = _trader;
        uniswapRouter = IUniswapRouter(_uniswapRouterAddress);
    }

    receive() external payable {}

    fallback() external payable {}


    function get_balance() public view returns (uint) {
        return address(this).balance;
    }

    function withdraw_funds(uint _amount) public {
        require(msg.sender == funder, "Only funder can withdraw funds");
        payable(funder).transfer(_amount);
    }

     function swapTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external {
        // Interact with the Uniswap contract
        uniswapRouter.swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline);
    }

    // ... trader functions to be implemented
}
