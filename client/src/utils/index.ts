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

export const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
