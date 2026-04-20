// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CheckIn} from "../src/CheckIn.sol";

contract CheckInTest is Test {
    CheckIn internal c;
    address internal alice = address(0xA11CE);

    function setUp() public {
        c = new CheckIn();
    }

    function test_CheckIn_FirstTime_StoresDay() public {
        uint256 t0 = 86400 * 900;
        vm.warp(t0);
        vm.prank(alice);
        c.checkIn();
        uint256 d = t0 / 86400;
        assertEq(c.lastCheckInStored(alice), d + 1);
    }

    function test_CheckIn_RevertIfNonZeroValue() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        vm.expectRevert(CheckIn.NonZeroValue.selector);
        c.checkIn{value: 1 wei}();
    }

    function test_CheckIn_RevertIfSameDay() public {
        vm.prank(alice);
        c.checkIn();
        vm.prank(alice);
        vm.expectRevert(CheckIn.AlreadyCheckedInToday.selector);
        c.checkIn();
    }

    function test_CheckIn_AllowsNextUtcDay() public {
        vm.prank(alice);
        c.checkIn();
        uint256 d0 = block.timestamp / 86400;
        vm.warp(block.timestamp + 86400);
        vm.prank(alice);
        c.checkIn();
        uint256 d1 = block.timestamp / 86400;
        assertEq(d1, d0 + 1);
        assertEq(c.lastCheckInStored(alice), d1 + 1);
    }

    function test_CheckIn_UtcDayBoundary() public {
        uint256 t0 = 86400 * 1200;
        vm.warp(t0);
        vm.prank(alice);
        c.checkIn();
        uint256 d = t0 / 86400;
        vm.warp(t0 + 86399);
        vm.prank(alice);
        vm.expectRevert(CheckIn.AlreadyCheckedInToday.selector);
        c.checkIn();
        vm.warp(t0 + 86400);
        vm.prank(alice);
        c.checkIn();
        assertEq(c.lastCheckInStored(alice), d + 2);
    }
}
