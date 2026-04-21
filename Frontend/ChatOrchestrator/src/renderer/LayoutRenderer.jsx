import { layoutRegistry } from "../registry/layoutRegistry";

export default function LayoutRenderer({ config }) {
  const { component_name, metadata } = config;

  const LayoutComponent = layoutRegistry[component_name];

  if (!LayoutComponent) {
    return <div>Component not found: {component_name}</div>;
  }

  return <LayoutComponent metadata={metadata} />;
}
