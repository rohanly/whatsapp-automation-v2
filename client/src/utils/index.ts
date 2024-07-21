export const convertToFormData = (obj: Object, form?: any, namespace?: any) => {
  const formData = form || new FormData();
  for (let property in obj) {
    if (!obj?.hasOwnProperty(property)) continue;
    let formKey = namespace ? `${namespace}[${property}]` : property;
    if (typeof obj[property] === "object" && !(obj[property] instanceof File)) {
      convertToFormData(obj[property], formData, formKey);
    } else {
      formData.append(formKey, obj[property]);
    }
  }
  return formData;
};
