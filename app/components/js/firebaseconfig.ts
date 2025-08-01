import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { COMPANYNAME } from "./config";
const config = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};
const app = initializeApp(config);
export const storage = getStorage(app);
export const uploadFile = async (
  title: string,
  parent: string = "form"
): Promise<string[]> => {
  const parentDiv = document.getElementById(`${parent}`);
  const children = parentDiv?.querySelectorAll("input[type=file]")!;
  const urls: string[] = [];
  for (let i = 0; i < children?.length; i++) {
    let image = children[i] as HTMLInputElement;
    const contImg = image.getAttribute("aria-describedby");
    if (image.files && image.files[0]) {
      const imgRef = ref(
        storage,
        `/${COMPANYNAME.split(" ")[0]}/images/${title}/${title}${i}`
      );
      await uploadBytes(imgRef, image.files[0]);
      const url = await getDownloadURL(imgRef);
      urls.push(url);
    } else if (contImg) {
      urls.push(contImg);
    }
  }
  return urls;
};
export const uploadBlogImage = async (
  title: string,
  parent: string = "form"
): Promise<{ img: string; ref: string }[]> => {
  const parentDiv = document.querySelector(`#${parent}`);
  const children = parentDiv?.querySelectorAll(".images")!;

  const urls: { img: string; ref: string }[] = [];
  for (let i = 0; i < children?.length; i++) {
    const imgCont = children[i].querySelector(
      "input[type=file]"
    )! as HTMLInputElement;
    let refCont = children[i].querySelector(
      "input[type=text]"
    )! as HTMLInputElement;
    const contImg = imgCont.getAttribute("aria-describedby");
    if (imgCont.files && imgCont.files[0]) {
      const imgRef = ref(
        storage,
        `/${COMPANYNAME.split(" ")[0]}/images/${title}/${title}${i}`
      );
      await uploadBytes(imgRef, imgCont.files[0]);
      const url = await getDownloadURL(imgRef);
      urls.push({ img: url, ref: refCont.value });
    } else if (contImg) {
      urls.push({ img: contImg, ref: refCont.value });
    }
  }
  return urls;
};
export const deleteFile = async (title: string, fileLen: number) => {
  try {
    for (let i = 0; i < fileLen; i++) {
      const fileRef = ref(
        storage,
        `/${COMPANYNAME.split(" ")[0]}/images/${title}/${title}${i}`
      );
      await deleteObject(fileRef);
    }
  } catch (error) {
    console.log(error);
  }
};
