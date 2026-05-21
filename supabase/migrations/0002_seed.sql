-- Seed data — mirrors `config/fallback.ts` so the LP renders the same
-- whether you read from Supabase or fallback. Safe to re-run with
-- `on conflict do nothing`.

-- Pricing groups
insert into pricing_groups (group_key, label, description, cost_base_vnd, sort_order) values
  ('A', 'Cơ bản',  'Egan, Bulbal cơ bản — vải mát, form gọn',          90000,  1),
  ('B', 'Trung',   'Riki, AKB, CV Sport — bestseller 120-140K',         100000, 2),
  ('C', 'Cao cấp', 'Justplay — vải dày dặn, in sắc nét',                115000, 3),
  ('D', 'Premium', 'Beyono — chất lượng top, form cực ôm',              140000, 4)
on conflict (group_key) do nothing;

-- Pricing tiers
insert into pricing_tiers (tier_key, qty_min, qty_max, margin_vnd, label, description, perks, is_popular, sort_order) values
  ('t1', 10, 19, 30000, 'Đặt đội cơ bản', 'Phù hợp 95% FC ở Huế–Đà Nẵng',
    array[
      'Free design + 1 mockup',
      'Tư vấn 1-1 với anh chủ shop',
      'Ship Miền Trung 1-2 ngày',
      'In tên + số sau lưng cơ bản'
    ], false, 1),
  ('t2', 20, 29, 25000, 'Phổ biến', 'Tiết kiệm hơn + tặng quà ưu tiên',
    array[
      'Free design + 2 mockup',
      'Tặng 1 áo dự bị cho FC trưởng',
      'Ship MT 1-2 ngày · MN/MB 2-3 ngày',
      'Voucher 10% áo retail cho thành viên'
    ], true, 2),
  ('t3', 30, null, 20000, 'Tiết kiệm tối đa', 'Cho FC giải / công ty đông người',
    array[
      'Free design + 3 mockup',
      'Tặng 2 áo dự bị + 1 áo training cho captain',
      'Banner FC PDF in LED (file print-ready)',
      'FC card 20 cái',
      'Freeship toàn quốc',
      'Ưu tiên giao 4 ngày'
    ], false, 3)
on conflict (tier_key) do nothing;

-- Brands
insert into brands (slug, name, group_key, description, is_active, sort_order) values
  ('cv',       'CV Sport', 'B', 'Form ôm, vải dày dặn, mã ''Steel'' đang là best-seller', true, 10),
  ('bulbal',   'Bulbal',   'A', 'Hãng VN OEM, mass-market, giá tốt',                      true, 20),
  ('riki',     'Riki',     'B', 'Form tiêu chuẩn, vải lưới — bestseller',                 true, 30),
  ('akb',      'AKB',      'B', 'Form ôm, in sắc nét, hợp đội phong trào',                true, 40),
  ('justplay', 'Justplay', 'C', 'Vải dày — hợp đá nắng, đá sương',                        true, 50),
  ('egan',     'Egan',     'A', 'Form gọn, giá tốt nhất',                                 true, 60),
  ('beyono',   'Beyono',   'D', 'Premium, vải kỹ thuật cao',                              true, 70)
on conflict (slug) do nothing;

-- CV Steel — 7 màu (CV Sport · Group B · retail 150K)
insert into products (slug, name, brand_id, group_key, primary_color, color_hex, fit, retail_price_vnd, image_url, image_urls, image_alt, badge, is_bestseller, is_active, sort_order)
select
  v.slug, v.name, b.id, 'B', v.primary_color, v.color_hex, 'tieu_chuan', 150000,
  v.image_url, array[v.image_url], v.alt, v.badge, v.is_best, true, v.sort_order
from (values
  ('cv-steel-xam',    'CV Steel Xám',    'Xám',    '#94a3b8', '/products/cv-steel/xam.jpg',    'CV Steel màu Xám — áo bóng đá + quần đùi đen, in tên + số sau lưng',     'Bán chạy', true,  10),
  ('cv-steel-co-vit', 'CV Steel Cổ Vịt', 'Cổ Vịt', '#1e6091', '/products/cv-steel/co-vit.jpg', 'CV Steel màu Cổ Vịt — áo bóng đá + quần đùi đen, in tên + số sau lưng', 'Bán chạy', true,  11),
  ('cv-steel-do',     'CV Steel Đỏ',     'Đỏ',     '#dc2626', '/products/cv-steel/do.jpg',     'CV Steel màu Đỏ — áo bóng đá + quần đùi đen, in tên + số sau lưng',     'Bán chạy', true,  12),
  ('cv-steel-tim',    'CV Steel Tím',    'Tím',    '#a78bfa', '/products/cv-steel/tim.jpg',    'CV Steel màu Tím — áo bóng đá + quần đùi đen, in tên + số sau lưng',    'Mới',      false, 13),
  ('cv-steel-reu',    'CV Steel Rêu',    'Rêu',    '#266b6b', '/products/cv-steel/reu.jpg',    'CV Steel màu Rêu — áo bóng đá + quần đùi đen, in tên + số sau lưng',    'Mới',      false, 14),
  ('cv-steel-kem',    'CV Steel Kem',    'Kem',    '#e7d9c2', '/products/cv-steel/kem.jpg',    'CV Steel màu Kem — áo bóng đá + quần đùi đen, in tên + số sau lưng',    'Mới',      false, 15),
  ('cv-steel-trang',  'CV Steel Trắng',  'Trắng',  '#f8fafc', '/products/cv-steel/trang.jpg',  'CV Steel màu Trắng — áo bóng đá + quần đùi đen, in tên + số sau lưng',  'Mới',      false, 16)
) as v(slug, name, primary_color, color_hex, image_url, alt, badge, is_best, sort_order)
join brands b on b.slug = 'cv'
on conflict (slug) do nothing;

-- Testimonials
insert into testimonials (customer_name, fc_name, location, content, rating, qty, brand_name, is_active, sort_order) values
  ('Anh Hoàng', 'FC Phú Vang',             'Huế',        'Đặt 18 áo CV Steel xám cho FC, anh tư vấn nhiệt tình, mockup đẹp, giao đúng hẹn 5 ngày. Lần sau đặt tiếp.', 5, 18, 'CV Sport', true, 10),
  ('Anh Tuấn',  'FC Đập Đá United',        'Huế',        'Lần đầu đặt áo team online cũng lo, anh cho qua shop xem mẫu trực tiếp. Giá hợp lý, in đẹp, áo bền sau 6 tháng đá.', 5, 15, 'Riki', true, 20),
  ('Chị Linh',  'CLB Bóng Đá Nữ Hương Sơ', 'Đà Nẵng',    'Đặt 25 bộ AKB cho CLB nữ — mockup làm đến 3 lần theo ý mọi người. Quà tặng banner FC rất xịn.', 5, 25, 'AKB', true, 30),
  ('Anh Phong', 'FC Đông Ba Ulster',       'Quảng Trị',  'Ship từ Huế ra QT chỉ 1 ngày. Áo y mockup, in tên + số sắc nét. Giá rẻ hơn shop khác bên SG mà còn được gặp anh tư vấn.', 5, 22, 'Bulbal', true, 40),
  ('Anh Quang', 'FC Sao Vàng',             'Huế',        'Đặt 32 áo Bulbal cho công ty đá phong trào, in thêm logo công ty. Tier 30+ tặng FC card, áo training — quá đáng tiền.', 5, 32, 'Bulbal', true, 50)
on conflict do nothing;

-- FAQs
insert into faqs (question, answer, is_active, sort_order) values
  ('Up logo đội lên có bị share / sao chép không?',
   'Không. Logo + tên FC anh up qua Zalo riêng cho mình, chỉ dùng để in lên áo của đội. Mình không share ra ngoài, không up lên Facebook nếu anh không cho phép. Sau khi giao hàng mình xoá file.',
   true, 10),
  ('Có COD (nhận hàng kiểm rồi mới trả tiền) không?',
   'Có — đơn ≥10 áo cọc 50% trước khi in, 50% còn lại trả khi nhận hàng (COD). FC ở Huế / Đà Nẵng có thể qua shop xem mẫu thực tế và trả tiền trực tiếp luôn.',
   true, 20),
  ('Nếu sai size hoặc in sai tên thì sao?',
   'Trước khi in mình gửi mockup digital cho anh duyệt 1 lần nữa — anh confirm rồi mới in. Nếu mình in sai vs mockup đã duyệt, mình in lại hoàn toàn miễn phí. Size áo theo chart công bố — nếu lệch size có thể đổi 1-1 trong 7 ngày.',
   true, 30),
  ('Thời gian làm bao lâu?',
   'Sau khi anh chốt mẫu + cọc, từ 4-7 ngày sản xuất + 1-2 ngày ship MT. Đơn 30+ áo có ưu tiên giao 4 ngày. Mùa cao điểm (T9-T11) có thể dài thêm 1-2 ngày, mình báo trước cho anh biết.',
   true, 40),
  ('Có in được logo công ty / nhà tài trợ không?',
   'Có. In ngực hoặc bụng đều được, mỗi vị trí +5K/áo. Nếu anh có file vector (AI, SVG, PDF) thì in ra sắc nét. File ảnh thường (JPG/PNG) độ phân giải thấp có thể in hơi mờ, mình sẽ báo trước.',
   true, 50),
  ('Bao gồm in tên + số chưa? Có phải tính thêm không?',
   'Giá team đã bao gồm in tên + số sau lưng cơ bản (1 dòng + 1 số). Add-on: in bụng / in quần / logo công ty / số mặt trước → +5K/mục. Hỏi anh cụ thể qua Zalo, mình báo giá rõ ràng.',
   true, 60)
on conflict do nothing;

-- Site config
insert into site_config (key, value) values
  ('main', '{
    "site_name": "ÁO BÓNG ĐÁ HUẾ",
    "site_tagline": "Xưởng in áo team #1 Miền Trung — Báo giá trong 5 phút, giao hàng 5 ngày.",
    "hotline": { "label": "Hotline", "number": "0905 123 456", "tel": "0905123456" },
    "zalo": { "label": "Zalo", "number": "0905123456", "url": "https://zalo.me/0905123456" },
    "address": {
      "line": "123 Nguyễn Trãi", "city": "Huế",
      "region": "Thừa Thiên Huế", "country": "Việt Nam"
    },
    "hours": "Thứ 2–CN · 8h–21h",
    "email": "info@aobongdahue.com",
    "facebook_url": "https://facebook.com/aobongdahue",
    "shopee_url": "",
    "founded_year": 2018,
    "total_fcs": 1200,
    "shopee_rating": 4.9,
    "domain": "aobongdahue.com",
    "promo_top_bar": "🔥 Tháng 5: Đặt 20 áo tặng 1 áo cho FC trưởng · 30 áo +banner FC PDF · Free ship MT"
  }'::jsonb)
on conflict (key) do nothing;
