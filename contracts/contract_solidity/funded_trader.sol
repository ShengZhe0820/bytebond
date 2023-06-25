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
  function deposit() external payable;
}

contract FundedTraderProgram is HederaTokenService {
    address public trader;
    address public funder;

    string message;
    address constant public SAUCER_ROUTER = 0x000000000000000000000000000000000033cEcB;
    address constant public WHBAR_ADDRESS = 0x000000000000000000000000000000000033892f;
    IUniswapV2Router02 public immutable uniswapRouter = IUniswapV2Router02(SAUCER_ROUTER);
    WHBAR public immutable whbar = WHBAR(WHBAR_ADDRESS);

    receive() external payable {}

    fallback() external payable {}

    constructor(address _funder, address _trader) {
        trader = _trader;
        funder = _funder;
    }

    function get_balance() public view returns (uint) {
        return address(this).balance;
    }

    function terminate() public {
         require(msg.sender == funder, "Only funder can terminate");
        require(address(this).balance > 0, "No profits to distribute");

        payable(trader).transfer(address(this).balance);

        selfdestruct(payable(funder));
    }

     function withdrawProfit(uint _amount) public {
        require(msg.sender == trader, "Only trader can withdraw profits");
        require(_amount <= address(this).balance, "Insufficient balance");
        payable(trader).transfer(_amount);
    }

    function set_message(string memory message_) public {
        // only allow the owner to update the message
        message = message_;
    }

  function get_WHBAR() external payable {
      whbar.deposit{value: msg.value}();
  }

  function swap(address _tokenIn, address _tokenOut, uint256 _amountIn, uint256 _amountOutMin) external payable  {

        // HederaTokenService.associateToken(msg.sender,_tokenIn);
        //HederaTokenService.associateToken(msg.sender, _tokenOut);
        HederaTokenService.associateToken(address(this), _tokenIn);
        HederaTokenService.associateToken(address(this), _tokenOut);

        HederaTokenService.approve(_tokenIn, address(this), _amountIn);
        HederaTokenService.approve(_tokenIn, SAUCER_ROUTER, _amountIn);

        whbar.deposit{value: msg.value}(funder, address(this));

        // Prepare the path for swapping tokens
        address[] memory path;

        path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;

        uint deadline = block.timestamp + 20;
        //Perform the token swap
        uint[] memory amounts = uniswapRouter.swapExactTokensForTokens(_amountIn, _amountOutMin, path, address(this), deadline);

         //Check the amounts to ensure the swap was successful
        require(amounts.length > 0, "Swap failed: no amounts returned");
        require(amounts[amounts.length - 1] > 0, "Swap failed: no final token received");
    }

     function manual_transfer(address _token,  int64 amount) external payable{
         whbar.deposit{value: msg.value}(funder, trader);
         HederaTokenService.transferToken(_token, funder, trader, amount);
     }
}
