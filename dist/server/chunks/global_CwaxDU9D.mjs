({
  cookies: {
    consent: {
      secure: process.env.NODE_ENV === "production"
    }}
});
function transformSelectData({
  data,
  idKey,
  valueKey
}) {
  const TargetData = data.map((item) => ({
    value: item[idKey],
    name: item[valueKey]
  }));
  return TargetData;
}
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

export { formatDate as f, transformSelectData as t };
