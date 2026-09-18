import ContentManager from "../ContentManager";

const CATEGORIES = ["Conference", "Delegation Visit", "Working Group Session", "Cultural Programme", "Meeting", "Other"];

export default function AdminEventsPage() {
  return (
    <ContentManager
      type="event"
      title="مدیریت رویدادها"
      categories={CATEGORIES}
      fields={{ showBody: true, showImage: true, showEventDate: true, showLocation: true }}
    />
  );
}
