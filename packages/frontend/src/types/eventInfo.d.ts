/** 事件信息 */
export interface EventInfo {
  /** 事件 ID */
  id: number;
  /** 事件名称 */
  name: string;
  /** 开始日期 */
  date: number;
  /** 地点 */
  location: string;
  /** 票价 */
  tickets: number;
  /** 总票数 */
  capacity: number;
  /** 描述 */
  description: string;
  /** 图片 */
  imageSrc: string;
}
