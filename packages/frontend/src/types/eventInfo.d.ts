/** 事件信息 */
export interface EventInfo {
  /** 事件 ID */
  id: Bigint;
  /** 事件名称 */
  name: string;
  /** 开始日期 */
  date: Bigint;
  /** 地点 */
  location: string;
  /** 票价 */
  ticketPrice: Bigint;
  /** 已售出的票数 */
  ticketsSold: Bigint;
  /** 总票数 */
  totalTickets: Bigint;
  /** 描述 */
  description: string;
  /** 图片 */
  imageSrc: string;
}
