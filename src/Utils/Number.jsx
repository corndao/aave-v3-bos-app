function isValid(a) {
  if (!a) return false;
  if (isNaN(Number(a))) return false;
  if (a === "") return false;
  return true;
}

function formatAmount(a) {
  return isValid(a)
    ? Number(a).toLocaleString(undefined, {
        minimumFractionDigits: 5,
        maximumFractionDigits: 5,
      })
    : a;
}

const { onLoad } = props;
if (onLoad && typeof onLoad === "function") {
  onLoad({
    isValid,
    formatAmount,
  });
}

return <div style={{ display: "none" }} />;
