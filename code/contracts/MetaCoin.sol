pragma solidity ^0.5.0;
import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoin {
    
    struct needer{
        address neederAddress;
        uint goal;
        uint amount;
        uint funderAccount;
        bool isCompelete;
    }

	uint neederAmount;

	mapping (address => uint) balances;
	mapping(address => needer) needmap;


	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	constructor() public {
		balances[tx.origin] = 10000;
	}

	function newNeeder(address _neederAddress,uint _goal) public returns(bool){
		neederAmount++;
		needmap[_neederAddress] = needer(_neederAddress,_goal,0,0,false);
		return true;
	}

	function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
		needer storage _needer = needmap[receiver];
		if(_needer.isCompelete != false){
			return false;
		}
		if (balances[msg.sender] < amount)
		{
			return false;
		}
		balances[msg.sender] -= amount;
		balances[_needer.neederAddress] += amount;

		_needer.amount += amount;
		_needer.funderAccount++;

		if(_needer.amount >= _needer.goal){
			_needer.isCompelete = true;
		}
		emit Transfer(msg.sender, _needer.neederAddress, amount);
		return true;
	}

	function getBalanceInEth(address addr) public view returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}

	function getGoal(address _neederAddress) public view returns(uint){
		return needmap[_neederAddress].goal;
	}

	function getFunderAccount(address _neederAddress) public view returns(uint) {
		return needmap[_neederAddress].funderAccount;
	}

	function getAmount(address _neederAddress) public view returns(uint) {
		return needmap[_neederAddress].amount;
	}

	function getIsComplete(address _neederAddress) public view returns(bool) {
		return needmap[_neederAddress].isCompelete;
	}

	function getNeederAmount() public view returns(uint){
		return neederAmount;
	}
}
