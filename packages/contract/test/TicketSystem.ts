import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Contract, Signer, ContractFactory } from 'ethers';

describe('TicketSystem', function () {
  let TicketSystem: ContractFactory;
  let ticketSystem: any;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    TicketSystem = await ethers.getContractFactory('TicketSystem');
    [owner, addr1, addr2] = await ethers.getSigners();
    ticketSystem = await TicketSystem.deploy();
    await ticketSystem.waitForDeployment();
  });

  describe('创建活动', function () {
    it('应该成功创建一个新活动', async function () {
      const eventName: string = '测试活动';
      const eventDate: number = Date.now() + 86400; // 明天
      const eventLocation: string = '测试地点';
      const totalTickets: number = 100;
      const ticketPrice: bigint = ethers.parseEther('0.1');

      await expect(
        ticketSystem.createEvent(eventName, eventDate, eventLocation, totalTickets, ticketPrice)
      )
        .to.emit(ticketSystem, 'EventCreated')
        .withArgs(1n, eventName, BigInt(eventDate), await owner.getAddress());

      const event = await ticketSystem.events(1n);
      expect(event.name).to.equal(eventName);
      expect(event.date).to.equal(BigInt(eventDate));
      expect(event.location).to.equal(eventLocation);
      expect(event.totalTickets).to.equal(BigInt(totalTickets));
      expect(event.ticketPrice).to.equal(ticketPrice);
      expect(event.isActive).to.be.true;
    });

    it('应该在日期无效时失败', async function () {
      const pastDate: number = Math.floor(Date.now() / 1000) - 86400; // 昨天
      await expect(
        ticketSystem.createEvent('过期活动', pastDate, '地点', 100, ethers.parseEther('0.1'))
      ).to.be.revertedWith('Event date must be in the future');
    });
  });

  describe('购买门票', function () {
    beforeEach(async function () {
      await ticketSystem.createEvent(
        '测试活动',
        Date.now() + 86400,
        '测试地点',
        100,
        ethers.parseEther('0.1')
      );
    });

    it('应该成功购买门票', async function () {
      await expect(ticketSystem.connect(addr1).buyTicket(1, { value: ethers.parseEther('0.1') }))
        .to.emit(ticketSystem, 'TicketPurchased')
        .withArgs(1n, 1n, await addr1.getAddress());

      const event = await ticketSystem.events(1n);
      expect(event.ticketsSold).to.equal(1n);
    });

    it('应该在价格不正确时失败', async function () {
      await expect(
        ticketSystem.connect(addr1).buyTicket(1, { value: ethers.parseEther('0.05') })
      ).to.be.revertedWith('Incorrect ticket price');
    });
  });

  describe('验证和使用门票', function () {
    beforeEach(async function () {
      await ticketSystem.createEvent(
        '测试活动',
        Date.now() + 86400,
        '测试地点',
        100,
        ethers.parseEther('0.1')
      );
      await ticketSystem.connect(addr1).buyTicket(1, { value: ethers.parseEther('0.1') });
    });

    it('应该成功验证有效的门票', async function () {
      const messageHash: string = await ticketSystem.getMessageHash(
        1n,
        1n,
        await addr1.getAddress()
      );
      const signature: string = await addr1.signMessage(ethers.getBytes(messageHash));
      expect(await ticketSystem.verifyTicket(1n, 1n, signature)).to.be.true;
    });

    it('应该成功使用有效的门票', async function () {
      const messageHash: string = await ticketSystem.getMessageHash(
        1n,
        1n,
        await addr1.getAddress()
      );
      const signature: string = await addr1.signMessage(ethers.getBytes(messageHash));

      await expect(ticketSystem.useTicket(1n, 1n, signature))
        .to.emit(ticketSystem, 'TicketUsed')
        .withArgs(1n, 1n, await addr1.getAddress());

      const ticket = await ticketSystem.tickets(1n, 1n);
      expect(ticket.isUsed).to.be.true;
    });

    it('应该在重复使用门票时失败', async function () {
      const messageHash: string = await ticketSystem.getMessageHash(
        1n,
        1n,
        await addr1.getAddress()
      );
      const signature: string = await addr1.signMessage(ethers.getBytes(messageHash));

      await ticketSystem.useTicket(1n, 1n, signature);

      await expect(ticketSystem.useTicket(1n, 1n, signature)).to.be.revertedWith(
        'Ticket has already been used'
      );
    });
  });
});
