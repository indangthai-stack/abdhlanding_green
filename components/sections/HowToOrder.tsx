import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const STEPS = [
  {
    n: 1,
    title: "Lướt mẫu &amp; chọn",
    body: "Lọc theo giá · màu · hãng. Mỗi mẫu hiện sẵn giá lẻ + giá team — không cần hỏi.",
    eta: "1 phút",
  },
  {
    n: 2,
    title: "Bấm Zalo trên mẫu đã chọn",
    body: "Tin nhắn đã điền sẵn tên mẫu + màu + SL. Anh chỉ cần kiểm tra rồi gửi.",
    eta: "1 phút",
  },
  {
    n: 3,
    title: "Báo giá chốt + duyệt mockup",
    body: "Mình gửi báo giá full đã in tên/số/logo + mockup digital qua Zalo trong cùng ngày.",
    eta: "trong ngày",
  },
  {
    n: 4,
    title: "Cọc 50% + sản xuất",
    body: "Anh chuyển khoản cọc 50%, mình bắt đầu in. Đơn ≥30 áo ưu tiên 4 ngày.",
    eta: "4–7 ngày",
  },
  {
    n: 5,
    title: "Nhận hàng + COD 50% còn lại",
    body: "Shipper giao tận nơi, anh kiểm hàng xong mới trả phần còn lại. Đổi 1-1 nếu sai size.",
    eta: "1–2 ngày MT",
  },
];

export function HowToOrder() {
  return (
    <section id="cach-dat" className="py-14 md:py-20">
      <Container>
        <SectionHeader
          eyebrow="Bước 3 · Cách đặt"
          title="5 bước · ~5 phút từ khi nhắn đến khi cọc."
          subtitle="Mình ưu tiên xử lý đơn team — không phải chờ đợi 24h như inbox Messenger bình thường."
        />

        <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-3">
          {STEPS.map((step, idx) => (
            <li
              key={step.n}
              className="relative flex flex-col rounded-2xl border border-line bg-bg-card p-5"
            >
              <span className="absolute -top-3 left-4 inline-flex size-7 items-center justify-center rounded-full bg-brand font-bold text-fg-inverse">
                {step.n}
              </span>
              <p
                className="mt-2 font-display text-base font-bold text-fg"
                dangerouslySetInnerHTML={{ __html: step.title }}
              />
              <p
                className="mt-1 flex-1 text-sm text-fg-muted"
                dangerouslySetInnerHTML={{ __html: step.body }}
              />
              <p className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-bg-soft px-2.5 py-1 text-[11px] font-semibold text-fg-muted">
                ⏱ {step.eta}
              </p>
              {idx < STEPS.length - 1 ? (
                <span
                  className="pointer-events-none absolute -right-2 top-12 hidden h-px w-4 bg-line-strong md:block"
                  aria-hidden
                />
              ) : null}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
