import moment from "moment/moment";

export const formatDate = (date, format = "YYYY-MM-DD HH:mm:ss") => {
  return moment(new Date(date).getTime()).format(format);
};
