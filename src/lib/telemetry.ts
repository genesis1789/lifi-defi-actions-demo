export function track(event: string, props: Record<string, unknown> = {}) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), event, ...props }, null, 2));
}
