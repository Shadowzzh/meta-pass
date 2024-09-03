// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

/// @title TicketSystem - 去中心化门票系统
/// @notice 这个合约允许创建活动、购买门票和验证门票所有权
contract TicketSystem is ReentrancyGuard {
    using ECDSA for bytes32;

    struct Event {
        string name; // 活动名称
        string location; // 活动地点
        string description; // 活动描述
        string imageSrc; // 活动图片
        uint256 date; // 活动日期（UNIX时间戳）
        uint256 totalTickets; // 总票数
        uint256 ticketsSold; // 已售出的票数
        uint256 ticketPrice; // 每张票的价格（以wei为单位）
        bool isActive; // 活动是否激活
    }

    struct Ticket {
        uint256 eventId; // 门票对应的活动ID
        address owner; // 门票所有者的地址
        bool isUsed; // 门票是否已使用
    }

    // 新增：存储所有事件ID的数组
    uint256[] public allEventIds;

    // 存储所有活动  eventId => event
    mapping(uint256 => Event) public events;
    // 存储活动创建者 eventId => address
    mapping(uint256 => address) public eventCreators;
    // 存储所有门票：eventId => ticketId => Ticket
    mapping(uint256 => mapping(uint256 => Ticket)) public tickets;
    // 存储用户拥有的门票ID：user => eventId => ticketIds
    mapping(address => mapping(uint256 => uint256[])) public userTicketIds;

    uint256 public nextEventId = 1; // 下一个活动ID
    uint256 public nextTicketId = 1; // 下一个门票ID

    // 事件声明
    event EventCreated(
        uint256 indexed eventId,
        string name,
        uint256 date,
        address creator
    );
    event TicketPurchased(
        uint256 indexed eventId,
        uint256 indexed ticketId,
        address buyer
    );
    event TicketUsed(uint256 indexed eventId, uint256 indexed ticketId, address user);

    /// @notice 创建新活动
    /// @param _name 活动名称
    /// @param _date 活动日期（UNIX时间戳）
    /// @param _location 活动地点
    /// @param _totalTickets 可用门票总数
    /// @param _ticketPrice 每张票的价格（以wei为单位）
    function createEvent(
        string memory _name,
        string memory _location,
        string memory _description,
        string memory _imageSrc,
        uint256 _date,
        uint256 _totalTickets,
        uint256 _ticketPrice
    ) public {
        require(_date > block.timestamp, 'Event date must be in the future');
        require(_totalTickets > 0, 'Total tickets must be greater than zero');

        uint256 eventId = nextEventId++;
        events[eventId] = Event(
            _name,
            _location,
            _description,
            _imageSrc,
            _date,
            _totalTickets,
            0,
            _ticketPrice,
            true
        );
        eventCreators[eventId] = msg.sender;
        allEventIds.push(eventId); // 新增：将新事件ID添加到数组

        emit EventCreated(eventId, _name, _date, msg.sender);
    }

    /// @notice 允许用户购买活动门票
    /// @param _eventId 活动ID
    function buyTicket(uint256 _eventId) public payable nonReentrant {
        Event storage _event = events[_eventId];
        require(_event.isActive, 'Event is not active');
        require(block.timestamp < _event.date, 'Event has already occurred');
        require(_event.ticketsSold < _event.totalTickets, 'Event is sold out');
        require(msg.value == _event.ticketPrice, 'Incorrect ticket price');

        uint256 ticketId = nextTicketId++;
        tickets[_eventId][ticketId] = Ticket(_eventId, msg.sender, false);
        userTicketIds[msg.sender][_eventId].push(ticketId);

        _event.ticketsSold++;

        emit TicketPurchased(_eventId, ticketId, msg.sender);
    }

    /// @notice 标记门票为已使用
    /// @param _eventId 活动ID
    /// @param _ticketId 门票ID
    /// @param _signature 证明门票所有权的签名
    function useTicket(
        uint256 _eventId,
        uint256 _ticketId,
        bytes memory _signature
    ) public {
        require(
            msg.sender == eventCreators[_eventId],
            'Only event creator can mark tickets as used'
        );
        require(
            verifyTicket(_eventId, _ticketId, _signature),
            'Invalid ticket or signature'
        );
        tickets[_eventId][_ticketId].isUsed = true;
        emit TicketUsed(_eventId, _ticketId, tickets[_eventId][_ticketId].owner);
    }

    /// @notice 获取所有活动
    /// @return 返回所有活动的数组
    function getAllEvents() public view returns (Event[] memory) {
        Event[] memory allEvents = new Event[](allEventIds.length);
        for (uint256 i = 0; i < allEventIds.length; i++) {
            allEvents[i] = events[allEventIds[i]];
        }
        return allEvents;
    }

    /// @notice 获取活动总数
    /// @return 返回活动的总数
    function getEventCount() public view returns (uint256) {
        return allEventIds.length;
    }

    /// @notice 验证门票的所有权和有效性
    /// @param _eventId 活动ID
    /// @param _ticketId 门票ID
    /// @param _signature 证明门票所有权的签名
    /// @return bool 表示门票是否有效且由签名者拥有
    function verifyTicket(
        uint256 _eventId,
        uint256 _ticketId,
        bytes memory _signature
    ) public view returns (bool) {
        Ticket memory ticket = tickets[_eventId][_ticketId];
        require(ticket.eventId == _eventId, 'Invalid ticket for this event');
        require(!ticket.isUsed, 'Ticket has already been used');

        // 生成消息哈希
        bytes32 messageHash = getMessageHash(_eventId, _ticketId, ticket.owner);

        // 转换为以太坊签名消息
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(
            messageHash
        );
        // 恢复签名者地址
        address signer = ECDSA.recover(ethSignedMessageHash, _signature);

        return signer == ticket.owner;
    }

    /// @notice 生成用于签名的消息哈希
    /// @param _eventId 活动ID
    /// @param _ticketId 门票ID
    /// @param _owner 门票所有者地址
    /// @return bytes32 待签名的消息哈希
    function getMessageHash(
        uint256 _eventId,
        uint256 _ticketId,
        address _owner
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_eventId, _ticketId, _owner));
    }

    // 可以添加更多功能，如退票、转让门票等
}
