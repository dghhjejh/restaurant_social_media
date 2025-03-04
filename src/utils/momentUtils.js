import moment from "moment";
import momentTz from "moment-timezone";
import "moment/locale/fr";

export const formatDateForReview = (dateString) => {
  return moment(dateString).locale("fr").format("D MMMM YYYY, HH[h]mm");
};

export const formatDateForAPIPost = (dateString) => {
  return momentTz(dateString)
    .tz("America/Toronto")
    .format("YYYY-MM-DDTHH:mm:ssZ");
};
