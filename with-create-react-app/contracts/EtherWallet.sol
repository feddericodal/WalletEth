// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;


contract EtherWallet {
   
    address public owner;

    
    constructor (){
        owner = msg.sender;
    }

  

    function deposit() payable public {
      //  wallets[msg.sender] += msg.value; // msg.value corrisponde a quanto viene dato di gas allo SC
    }

   
    function withdraw(address payable reciver, uint amount) public {
      require(msg.sender == owner, "solo il propietario puo mandare ether");
      reciver.transfer(amount);
    }

    // Todo: Add a function to view the current balance for your own wallet
    function myBalance() view public returns(uint) {
       return  address(this).balance;
    }
}
