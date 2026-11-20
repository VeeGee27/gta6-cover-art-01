// Fixed scenes for screenshots and deep links.
// ?shot=cover shows the cover alone; ?shot=editor shows the full studio.
// Scene knobs: layout, grade, frame, title (title style), size, caption,
// subtitle, photos (comma-separated sample names, one per panel).
// window.__shotReady is set once the scene has painted.

export function readScene(query) {
  const scene = {};
  const layout = query.get('layout');
  if (layout) scene.layout = layout;
  const grade = query.get('grade');
  if (grade) scene.grade = grade;
  const frame = query.get('frame');
  if (frame) scene.frame = frame;
  const title = query.get('title');
  if (title) scene.titleStyle = title;
  const size = query.get('size');
  if (size) scene.size = size;
  const caption = query.get('caption');
  if (caption !== null) scene.title = caption;
  const subtitle = query.get('subtitle');
  if (subtitle !== null) scene.subtitle = subtitle;
  const photos = query.get('photos');
  if (photos) scene.photos = photos.split(',').map((s) => s.trim()).filter(Boolean);
  return scene;
}

export async function runShot(shot, query, api) {
  if (shot === 'cover') document.body.classList.add('shot-cover');
  const scene = readScene(query);
  await api.applyScene(scene);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    window.__shotReady = true;
    if (api.markReady) api.markReady();
  }));
}
