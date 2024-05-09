// src/utils/generateSlug.ts
function generateSlug(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().replace(/-{2,}/g, "-").replace(/^-/, "").replace(/-$/, "");
}

export {
  generateSlug
};
