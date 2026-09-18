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

const INVESTMENT_TYPE_OPTIONS = [
  "Participation agreement",
  "Build-operate-transfer",
  "Joint venture",
  "Land lease",
];

export default function AdminInvestmentPage() {
  return (
    <ContentManager
      type="investment"
      title="فرصت‌های سرمایه‌گذاری"
      categories={CATEGORIES}
      fields={{
        showBody: true,
        showImage: true,
        showEventDate: true,
        showLocation: true,
        locationLabel: "منطقه / محله (District)",
        statusOptions: STATUS_OPTIONS,
        showInvestmentDetails: true,
        investmentTypeOptions: INVESTMENT_TYPE_OPTIONS,
      }}
    />
  );
}
