/**
 * Seed / fallback data — keeps the LP renderable without Supabase.
 *
 * When Supabase is configured (`NEXT_PUBLIC_SUPABASE_URL` + key env vars),
 * `lib/data.ts → loadLandingPageData()` swaps these out for live data.
 * Until then, this file is the single source of truth for content.
 *
 * To add a new product / brand / tier without code changes, use the admin
 * UI at `/admin` once Supabase is hooked up.
 */
import type {
  Brand,
  Faq,
  PricingGroup,
  PricingTier,
  Product,
  SiteConfig,
  Testimonial,
} from "@/lib/supabase/types";

export const FALLBACK_PRICING_GROUPS: PricingGroup[] = [
  { group_key: "A", label: "Cơ bản",   description: "Egan, Bulbal cơ bản — vải mát, form gọn",       cost_base_vnd: 90000,  sort_order: 1 },
  { group_key: "B", label: "Trung",    description: "Riki, AKB, CV Sport — bestseller 120-140K",      cost_base_vnd: 100000, sort_order: 2 },
  { group_key: "C", label: "Cao cấp",  description: "Justplay — vải dày dặn, in sắc nét",            cost_base_vnd: 115000, sort_order: 3 },
  { group_key: "D", label: "Premium",  description: "Beyono — chất lượng top, form cực ôm",          cost_base_vnd: 140000, sort_order: 4 },
];

export const FALLBACK_BRANDS: Brand[] = [
  { id: 1, slug: "cv",       name: "CV Sport", group_key: "B", logo_url: null, description: "Form ôm, vải dày dặn, mã 'Steel' đang là best-seller", is_active: true, sort_order: 10, created_at: "" },
  { id: 2, slug: "bulbal",   name: "Bulbal",   group_key: "A", logo_url: null, description: "Hãng VN OEM, mass-market, giá tốt",                     is_active: true, sort_order: 20, created_at: "" },
  { id: 3, slug: "riki",     name: "Riki",     group_key: "B", logo_url: null, description: "Form tiêu chuẩn, vải lưới — bestseller",                is_active: true, sort_order: 30, created_at: "" },
  { id: 4, slug: "akb",      name: "AKB",      group_key: "B", logo_url: null, description: "Form ôm, in sắc nét, hợp đội phong trào",               is_active: true, sort_order: 40, created_at: "" },
  { id: 5, slug: "justplay", name: "Justplay", group_key: "C", logo_url: null, description: "Vải dày — hợp đá nắng, đá sương",                       is_active: true, sort_order: 50, created_at: "" },
  { id: 6, slug: "egan",     name: "Egan",     group_key: "A", logo_url: null, description: "Form gọn, giá tốt nhất",                                is_active: true, sort_order: 60, created_at: "" },
  { id: 7, slug: "beyono",   name: "Beyono",   group_key: "D", logo_url: null, description: "Premium, vải kỹ thuật cao",                             is_active: true, sort_order: 70, created_at: "" },
];

export const FALLBACK_PRICING_TIERS: PricingTier[] = [
  {
    id: 1, tier_key: "t1", qty_min: 10, qty_max: 19, margin_vnd: 30000,
    label: "Đặt đội cơ bản",
    description: "Phù hợp 95% FC ở Huế–Đà Nẵng",
    perks: [
      "Free design + 1 mockup",
      "Tư vấn 1-1 với anh chủ shop",
      "Ship Miền Trung 1-2 ngày",
      "In tên + số sau lưng cơ bản",
    ],
    is_popular: false, sort_order: 1,
  },
  {
    id: 2, tier_key: "t2", qty_min: 20, qty_max: 29, margin_vnd: 25000,
    label: "Phổ biến",
    description: "Tiết kiệm hơn + tặng quà ưu tiên",
    perks: [
      "Free design + 2 mockup",
      "Tặng 1 áo dự bị cho FC trưởng",
      "Ship MT 1-2 ngày · MN/MB 2-3 ngày",
      "Voucher 10% áo retail cho thành viên",
    ],
    is_popular: true, sort_order: 2,
  },
  {
    id: 3, tier_key: "t3", qty_min: 30, qty_max: null, margin_vnd: 20000,
    label: "Tiết kiệm tối đa",
    description: "Cho FC giải / công ty đông người",
    perks: [
      "Free design + 3 mockup",
      "Tặng 2 áo dự bị + 1 áo training cho captain",
      "Banner FC PDF in LED (file print-ready)",
      "FC card 20 cái",
      "Freeship toàn quốc",
      "Ưu tiên giao 4 ngày",
    ],
    is_popular: false, sort_order: 3,
  },
];

const brandBySlug = (slug: string) =>
  FALLBACK_BRANDS.find((b) => b.slug === slug)!;

// Helper to construct a CV Steel variant (all share the same fields except color).
function cvSteel(
  id: number,
  colorSlug: string,
  colorVi: string,
  colorHex: string,
  isBestseller: boolean,
  sortOrder: number,
): Product {
  return {
    id,
    slug: `cv-steel-${colorSlug}`,
    name: `CV Steel ${colorVi}`,
    brand_id: brandBySlug("cv").id,
    group_key: "B",
    primary_color: colorVi,
    color_hex: colorHex,
    fit: "tieu_chuan",
    retail_price_vnd: 150000,
    image_url: `/products/cv-steel/${colorSlug}.jpg`,
    image_urls: [`/products/cv-steel/${colorSlug}.jpg`],
    image_alt: `CV Steel màu ${colorVi} — áo bóng đá + quần đùi đen, in tên + số sau lưng`,
    badge: isBestseller ? "Bán chạy" : "Mới",
    is_bestseller: isBestseller,
    is_active: true,
    sort_order: sortOrder,
    created_at: "",
    brand: { id: brandBySlug("cv").id, slug: "cv", name: "CV Sport" },
  };
}

export const FALLBACK_PRODUCTS: Product[] = [
  // CV Steel — first model anh Tam shipped. 7 colors, retail 150K, team 130/125/120K.
  cvSteel(1, "xam",    "Xám",    "#94a3b8", true,  10),
  cvSteel(2, "co-vit", "Cổ Vịt", "#1e6091", true,  11),
  cvSteel(3, "do",     "Đỏ",     "#dc2626", true,  12),
  cvSteel(4, "tim",    "Tím",    "#a78bfa", false, 13),
  cvSteel(5, "reu",    "Rêu",    "#266b6b", false, 14),
  cvSteel(6, "kem",    "Kem",    "#e7d9c2", false, 15),
  cvSteel(7, "trang",  "Trắng",  "#f8fafc", false, 16),
];

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: 1, customer_name: "Anh Hoàng", fc_name: "FC Phú Vang",            location: "Huế",        content: "Đặt 18 áo CV Steel xám cho FC, anh tư vấn nhiệt tình, mockup đẹp, giao đúng hẹn 5 ngày. Lần sau đặt tiếp.", rating: 5, qty: 18, brand_name: "CV Sport", is_active: true, sort_order: 10, created_at: "" },
  { id: 2, customer_name: "Anh Tuấn",  fc_name: "FC Đập Đá United",       location: "Huế",        content: "Lần đầu đặt áo team online cũng lo, anh cho qua shop xem mẫu trực tiếp. Giá hợp lý, in đẹp, áo bền sau 6 tháng đá.",                rating: 5, qty: 15, brand_name: "Riki",     is_active: true, sort_order: 20, created_at: "" },
  { id: 3, customer_name: "Chị Linh",  fc_name: "CLB Bóng Đá Nữ Hương Sơ", location: "Đà Nẵng",   content: "Đặt 25 bộ AKB cho CLB nữ — mockup làm đến 3 lần theo ý mọi người. Quà tặng banner FC rất xịn.",                                     rating: 5, qty: 25, brand_name: "AKB",      is_active: true, sort_order: 30, created_at: "" },
  { id: 4, customer_name: "Anh Phong", fc_name: "FC Đông Ba Ulster",      location: "Quảng Trị",  content: "Ship từ Huế ra QT chỉ 1 ngày. Áo y mockup, in tên + số sắc nét. Giá rẻ hơn shop khác bên SG mà còn được gặp anh tư vấn.",         rating: 5, qty: 22, brand_name: "Bulbal",   is_active: true, sort_order: 40, created_at: "" },
  { id: 5, customer_name: "Anh Quang", fc_name: "FC Sao Vàng",            location: "Huế",        content: "Đặt 32 áo Bulbal cho công ty đá phong trào, in thêm logo công ty. Tier 30+ tặng FC card, áo training — quá đáng tiền.",            rating: 5, qty: 32, brand_name: "Bulbal",   is_active: true, sort_order: 50, created_at: "" },
];

export const FALLBACK_FAQS: Faq[] = [
  {
    id: 1, question: "Up logo đội lên có bị share / sao chép không?",
    answer: "Không. Logo + tên FC anh up qua Zalo riêng cho mình, chỉ dùng để in lên áo của đội. Mình không share ra ngoài, không up lên Facebook nếu anh không cho phép. Sau khi giao hàng mình xoá file.",
    is_active: true, sort_order: 10, created_at: "",
  },
  {
    id: 2, question: "Có COD (nhận hàng kiểm rồi mới trả tiền) không?",
    answer: "Có — đơn ≥10 áo cọc 50% trước khi in, 50% còn lại trả khi nhận hàng (COD). FC ở Huế / Đà Nẵng có thể qua shop xem mẫu thực tế và trả tiền trực tiếp luôn.",
    is_active: true, sort_order: 20, created_at: "",
  },
  {
    id: 3, question: "Nếu sai size hoặc in sai tên thì sao?",
    answer: "Trước khi in mình gửi mockup digital cho anh duyệt 1 lần nữa — anh confirm rồi mới in. Nếu mình in sai vs mockup đã duyệt, mình in lại hoàn toàn miễn phí. Size áo theo chart công bố — nếu lệch size có thể đổi 1-1 trong 7 ngày.",
    is_active: true, sort_order: 30, created_at: "",
  },
  {
    id: 4, question: "Thời gian làm bao lâu?",
    answer: "Sau khi anh chốt mẫu + cọc, từ 4-7 ngày sản xuất + 1-2 ngày ship MT. Đơn 30+ áo có ưu tiên giao 4 ngày. Mùa cao điểm (T9-T11) có thể dài thêm 1-2 ngày, mình báo trước cho anh biết.",
    is_active: true, sort_order: 40, created_at: "",
  },
  {
    id: 5, question: "Có in được logo công ty / nhà tài trợ không?",
    answer: "Có. In ngực hoặc bụng đều được, mỗi vị trí +5K/áo. Nếu anh có file vector (AI, SVG, PDF) thì in ra sắc nét. File ảnh thường (JPG/PNG) độ phân giải thấp có thể in hơi mờ, mình sẽ báo trước.",
    is_active: true, sort_order: 50, created_at: "",
  },
  {
    id: 6, question: "Bao gồm in tên + số chưa? Có phải tính thêm không?",
    answer: "Giá team đã bao gồm in tên + số sau lưng cơ bản (1 dòng + 1 số). Add-on: in bụng / in quần / logo công ty / số mặt trước → +5K/mục. Hỏi anh cụ thể qua Zalo, mình báo giá rõ ràng.",
    is_active: true, sort_order: 60, created_at: "",
  },
];

export const FALLBACK_SITE_CONFIG: SiteConfig = {
  site_name: "ÁO BÓNG ĐÁ HUẾ",
  site_tagline: "Xưởng in áo team #1 Miền Trung — Báo giá trong 5 phút, giao hàng 5 ngày.",
  hotline: { label: "Hotline", number: "0905 123 456", tel: "0905123456" },
  zalo: { label: "Zalo", number: "0905123456", url: "https://zalo.me/0905123456" },
  address: {
    line: "123 Nguyễn Trãi",
    city: "Huế",
    region: "Thừa Thiên Huế",
    country: "Việt Nam",
  },
  hours: "Thứ 2–CN · 8h–21h",
  email: "info@aobongdahue.com",
  facebook_url: "https://facebook.com/aobongdahue",
  shopee_url: "",
  founded_year: 2018,
  total_fcs: 1200,
  shopee_rating: 4.9,
  domain: "aobongdahue.com",
  promo_top_bar:
    "🔥 Tháng 5: Đặt 20 áo tặng 1 áo cho FC trưởng · 30 áo +banner FC PDF · Free ship MT",
};
