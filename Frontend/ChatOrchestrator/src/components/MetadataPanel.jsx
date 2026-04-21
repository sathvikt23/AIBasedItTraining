export default function MetadataPanel({ config, setConfig }) {
  const updateField = (field, value) => {
    setConfig({
      ...config,
      metadata: {
        ...config.metadata,
        [field]: value
      }
    });
  };

  return (
    <div className="w-80 border-r p-4 bg-white space-y-3">
      <h2 className="font-bold text-lg">Metadata</h2>

      <div>
        <label className="text-sm">Title</label>
        <input
          value={config.metadata.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="text-sm">Content</label>
        <textarea
          value={config.metadata.content || ""}
          onChange={(e) => updateField("content", e.target.value)}
          className="border p-2 w-full h-24"
        />
      </div>
    </div>
  );
}
