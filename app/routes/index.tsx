import type { MetaFunction } from "remix";

export let meta: MetaFunction = () => ({
  title: "Sentinel",
});

export default function Index() {
  return <div>hi</div>;
}
