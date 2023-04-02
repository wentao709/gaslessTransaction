pragma solidity ^0.8.0;

contract SendTips {
    
    function send(address payable _to) public payable {
        require(msg.value > 0, "You must send some ether!");
        _to.transfer(msg.value);
    }
    
}