// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.12 <0.9.0;

import "https://github.com/hashgraph/hedera-smart-contracts/blob/main/contracts/hts-precompile/HederaResponseCodes.sol";
import "https://github.com/hashgraph/hedera-smart-contracts/blob/main/contracts/hts-precompile/HederaTokenService.sol";

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

interface WHBAR {
    function deposit(address src, address dst) external payable;
}

contract FundedTraderProgram is HederaTokenService {
    address public trader;
    address public funder;
    address public constant SAUCER_ROUTER =
        0x000000000000000000000000000000000033cEcB;
    address public constant WHBAR_ADDRESS =
        0x000000000000000000000000000000000033892f;
    IUniswapV2Router02 public immutable uniswapRouter =
        IUniswapV2Router02(SAUCER_ROUTER);
    WHBAR public immutable whbar = WHBAR(WHBAR_ADDRESS);

    receive() external payable {}

    fallback() external payable {}

    function get_balance() public view returns (uint) {
        return address(this).balance;
    }

    function withdraw_funds(uint _amount) public {
        require(msg.sender == funder, "Only funder can withdraw funds");
        payable(funder).transfer(_amount);
    }

    // function token_associate(address sender,address _token) external {
    //     int response = HederaTokenService.associateToken(sender, _token);

    //     if (response != HederaResponseCodes.SUCCESS) {
    //         revert ("Associate Failed");
    //     }
    // }
    function swap(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _amountOutMin
    ) external payable {
        // HederaTokenService.associateToken(msg.sender,_tokenIn);
        //HederaTokenService.associateToken(msg.sender, _tokenOut);
        HederaTokenService.associateToken(address(this), _tokenIn);
        HederaTokenService.associateToken(address(this), _tokenOut);

        HederaTokenService.approve(_tokenIn, address(this), _amountIn);
        HederaTokenService.approve(_tokenIn, SAUCER_ROUTER, _amountIn);

        whbar.deposit{value: msg.value}(msg.sender, address(this));

        // Prepare the path for swapping tokens
        address[] memory path;

        path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;

        uint deadline = block.timestamp + 20;
        //Perform the token swap
        uint[] memory amounts = uniswapRouter.swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            path,
            address(this),
            deadline
        );

        //Check the amounts to ensure the swap was successful
        require(amounts.length > 0, "Swap failed: no amounts returned");
        require(
            amounts[amounts.length - 1] > 0,
            "Swap failed: no final token received"
        );
    }

    function manual_transfer(
        address _token,
        address _receiver,
        int64 amount
    ) external {
        HederaTokenService.transferToken(_token, msg.sender, _receiver, amount);
    }
    // ... trader functions to be implemented
}
