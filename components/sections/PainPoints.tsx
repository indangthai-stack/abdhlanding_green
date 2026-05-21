import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MessageSquareWarning, Loader2, ImageOff, FileQuestion } from "lucide-react";

const PAINS = [
  {
    Icon: MessageSquareWarning,
    title: "Chat 30 phút mới biết giá",
    body: "Khách phải mô tả số lượng, brand, mẫu… mới được báo giá. Đa số bỏ chat giữa chừng.",
  },
  {
    Icon: Loader2,
    title: "Sai mẫu, sai size, đổi mệt",
    body: "Chốt rồi mới biết hết hàng / sai size — fan FC bực vì mất thời gian, shop mất uy tín.",
  },
  {
    Icon: ImageOff,
    title: "Không xem được mẫu thật",
    body: "Hỏi mẫu cam, đỏ, trắng → shop gửi từng ảnh một, mất thời gian + bỏ sót mẫu đẹp.",
  },
  {
    Icon: FileQuestion,
    title: "Không rõ tier giảm bao nhiêu",
    body: "Đặt 18 vs 22 áo khác giá nhiều không? FC trưởng không tự tính được nên ngại hỏi tiếp.",
  },
];

const SOLUTIONS = [
  {
    title: "Bảng giá rõ ràng",
    body: "Mỗi mẫu hiện giá lẻ + giá team. Không cần hỏi, anh tự tính được luôn.",
  },
  {
    title: "Lọc theo giá · màu · hãng",
    body: "Khách tự tìm mẫu vừa ý — shop chỉ chốt đơn, không phải gửi từng ảnh nữa.",
  },
  {
    title: "Tier benefits cụ thể",
    body: "Đặt 20 áo tặng 1 áo. 30 áo có banner FC. Không phải đoán mò %.",
  },
];

export function PainPoints() {
  return (
    <section id="pain-points" className="border-y border-line bg-bg-soft py-14 md:py-20">
      <Container>
        <SectionHeader
          eyebrow="Khác biệt"
          title="Không bắt anh điền form trước khi xem giá."
          subtitle="Trang này được dựng lại để anh tự tính, tự chọn, tự lọc — chỉ cần nhắn Zalo khi đã sẵn sàng đặt."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-danger/20 bg-danger-soft/40 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-danger">
              Trải nghiệm cũ (bên Messenger)
            </p>
            <ul className="mt-4 space-y-3">
              {PAINS.map((p) => (
                <li key={p.title} className="flex gap-3">
                  <p.Icon className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden />
                  <div>
                    <p className="text-sm font-semibold text-fg">{p.title}</p>
                    <p className="text-sm text-fg-muted">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-success/20 bg-success-soft/40 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-success">
              Trải nghiệm mới trên trang này
            </p>
            <ul className="mt-4 space-y-3">
              {SOLUTIONS.map((s) => (
                <li key={s.title} className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-[11px] font-bold text-fg-inverse">
                    ✓
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-fg">{s.title}</p>
                    <p className="text-sm text-fg-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
