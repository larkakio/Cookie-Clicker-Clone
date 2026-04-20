// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Daily check-in on Base. Day index is `block.timestamp / 86400` (UTC).
/// @dev `lastCheckInStored` is `0` = never checked; otherwise `utcDayIndex + 1`.
contract CheckIn {
    uint256 internal constant DAY = 86400;

    mapping(address => uint256) public lastCheckInStored;

    event CheckedIn(address indexed user, uint256 dayIndex);

    error NonZeroValue();
    error AlreadyCheckedInToday();

    function checkIn() external payable {
        if (msg.value != 0) revert NonZeroValue();

        uint256 day = block.timestamp / DAY;
        uint256 stored = lastCheckInStored[msg.sender];

        if (stored != 0 && stored - 1 == day) revert AlreadyCheckedInToday();

        lastCheckInStored[msg.sender] = day + 1;
        emit CheckedIn(msg.sender, day);
    }
}
