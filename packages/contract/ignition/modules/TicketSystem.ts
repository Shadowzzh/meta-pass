import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const TicketSystemModule = buildModule('TicketSystemModule', (m) => {
  const ticketSystem = m.contract('TicketSystem');

  return { ticketSystem };
});

export default TicketSystemModule;
