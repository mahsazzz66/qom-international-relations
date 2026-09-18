import ContentManager from "../ContentManager";

const CATEGORIES = [
  "International Meetings",
  "International Delegations",
  "Agreements & Cooperation",
  "Pilgrimage Cities",
  "Events & Conferences",
  "Investment",
  "Urban Diplomacy",
  "Announcements",
];

export default function AdminNewsPage() {
  return (
    <ContentManager
      type="news"
      title="مدیریت اخبار"
      categories={CATEGORIES}
      fields={{ showBody: true, showImage: true }}
    />
  );
}
