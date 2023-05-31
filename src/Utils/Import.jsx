// `modules` are an array of components path who must have an `onLoad` callback props that return functions
// `onLoad` needs to be defined in the parent component for receiving the loaded functions
const { modules, onLoad } = props;

// Helper function
function hasCommonKeys(a, b) {
  if (!a || !b) return false;
  const commonKeys = Object.keys(a).filter((key) => key in b);
  return commonKeys.length > 0;
}

State.init({
  imports: null,
  loadedModules: 0,
});

// Import functions from modules
function importFunctions(imports) {
  const loadedModules = state.loadedModules;
  if (!state.imports) {
    State.update({
      imports,
      loadedModules: loadedModules + 1,
    });
  } else if (!hasCommonKeys(state.imports, imports)) {
    const updated = {
      ...state.imports,
      ...imports,
    };
    State.update({
      imports: updated,
      loadedModules: loadedModules + 1,
    });
  }
  // invoke `onLoad` if all modules are ready
  if (
    state.loadedModules >= modules.length &&
    onLoad &&
    typeof onLoad === "function"
  ) {
    onLoad(state.imports);
  }
}

const importedModules = !modules ? (
  <div />
) : (
  <>
    {modules.map((path) => (
      <Widget src={path} props={{ onLoad: importFunctions }} />
    ))}
  </>
);

return <div style={{ display: "none" }}>{importedModules}</div>;
