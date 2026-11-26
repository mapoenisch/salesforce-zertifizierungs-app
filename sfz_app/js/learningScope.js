const certifications = ["foundations", "administrator"];
const paths = ["foundations", "administrator", "administrator-full"];

export function belongsToTrainer(record) {
  return certifications.includes(record?.certification);
}

export function supportedPath(path) {
  return paths.includes(path) ? path : null;
}
