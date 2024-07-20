import moment from "moment";

export function formatDate(date: any) {
  return moment(date).format("D/M/yyyy");
}

export function toDate(dateString: any) {
  return moment(dateString).toDate();
}
