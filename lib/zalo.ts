/**
 * Zalo deep-link builder with pre-filled message templates.
 * Format: `https://zalo.me/<number>?text=<urlencoded>`.
 *
 * The point: when a customer clicks a product card, Zalo opens with the
 * model name + chosen qty already typed. The shop just confirms cọc.
 */

export interface ZaloMessageContext {
  /** Quantity tier label, e.g. "20-29 áo". */
  qtyTier?: string;
  /** Single quantity, e.g. 25. */
  qty?: number;
  /** Product the customer clicked from. */
  productName?: string;
  /** Brand. */
  brandName?: string;
  /** Optional color choice. */
  color?: string;
}

/** Build a Zalo deep-link with a pre-filled message. */
export function buildZaloLink(
  zaloNumber: string,
  ctx: ZaloMessageContext = {},
): string {
  const text = buildZaloMessage(ctx);
  return `https://zalo.me/${zaloNumber}?text=${encodeURIComponent(text)}`;
}

/** Generate the message text for `buildZaloLink`. */
export function buildZaloMessage(ctx: ZaloMessageContext): string {
  const { qty, qtyTier, productName, brandName, color } = ctx;

  const qtyPart = qty
    ? `khoảng ${qty} áo`
    : qtyTier
      ? `khoảng ${qtyTier}`
      : "khoảng [SỐ LƯỢNG] áo";

  if (productName) {
    const colorPart = color ? ` (màu ${color})` : "";
    const brandPart = brandName ? ` — hãng ${brandName}` : "";
    return (
      `Anh ơi, đội em ${qtyPart}. Em thích mẫu **${productName}**${colorPart}${brandPart}. ` +
      `Anh báo giá đã in tên + số sau lưng giúp em với. Cảm ơn anh.`
    );
  }

  return (
    `Anh ơi, đội em đang cần đặt áo, ${qtyPart}. ` +
    `Anh tư vấn mẫu giúp em với. Cảm ơn anh.`
  );
}

/** Generic enquiry deep-link (used for hotline / sticky bars). */
export function genericZaloLink(zaloNumber: string): string {
  return buildZaloLink(zaloNumber);
}
