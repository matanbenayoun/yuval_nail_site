export const SITE_CONFIG = {
  name: "יובל סין ראובן",
  subtitle: "ציפורניים",
  city: "באר שבע",
  address: "עבדת 14, שכונת נאות לון, באר שבע",
  phone: "050-393-3353",
  whatsapp: "972503933353",
  whatsappMessage: "שלום יובל! אני מעוניינת לקבוע תור 💅",
  instagram: "yuval_sin_reuven_nail",
  instagramUrl: "https://www.instagram.com/yuval_sin_reuven_nail",
  wazeUrl: "https://waze.com/ul?q=עבדת+14+נאות+לון+באר+שבע&navigate=yes",
  mapsUrl: "https://maps.google.com/?q=עבדת+14+נאות+לון+באר+שבע",
}

export function whatsappHref(message = SITE_CONFIG.whatsappMessage) {
  return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`
}
