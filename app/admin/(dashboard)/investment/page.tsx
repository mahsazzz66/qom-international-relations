import ContentManager from "../ContentManager";

const CATEGORIES = [
  "Urban Development",
  "Smart City Projects",
  "Transportation",
  "Tourism Infrastructure",
  "Cultural Projects",
  "Technology & Innovation",
];

const STATUS_OPTIONS = ["Open for participation", "In preparation", "Under review"];

export default function AdminInvestmentPage() {
  return (
    <ContentManager
      type="investment"
      title="فرصت‌های سرمایه‌گذاری"
      categories={CATEGORIES}
      fields={{
        showBody: true,
        showImage: true,
        showLocation: true,
        locationLabel: "منطقه / محله (District)",
        statusOptions: STATUS_OPTIONS,
      }}
    />
  );
}
