import ContentManager from "../ContentManager";

const CATEGORIES = [
  "Official Message",
  "Municipal Statement",
  "Congratulations",
  "Condolence",
  "Announcement",
  "Official Position",
];

export default function AdminStatementsPage() {
  return (
    <ContentManager
      type="statement"
      title="مدیریت بیانیه‌ها و پیام‌های رسمی"
      categories={CATEGORIES}
      fields={{ showBody: true }}
    />
  );
}
