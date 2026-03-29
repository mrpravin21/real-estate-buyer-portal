/**
 * Resize and compress to JPEG data URL for storage in Postgres (keeps payload reasonable).
 */
export function fileToAvatarDataUrl(file: File): Promise<string> {
  if (file.size > 2 * 1024 * 1024) {
    return Promise.reject(new Error("Please choose an image under 2 MB."));
  }
  if (!/^image\/(jpeg|jpg|png|webp)$/i.test(file.type)) {
    return Promise.reject(new Error("Use a JPG, PNG, or WebP file."));
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const maxSide = 512;
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w > maxSide || h > maxSide) {
          if (w >= h) {
            h = Math.round((h * maxSide) / w);
            w = maxSide;
          } else {
            w = Math.round((w * maxSide) / h);
            h = maxSide;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Could not process image."));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        if (dataUrl.length > 1_100_000) {
          reject(new Error("Image is still too large after compression — try another photo."));
          return;
        }
        resolve(dataUrl);
      } catch {
        URL.revokeObjectURL(url);
        reject(new Error("Could not process image."));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image."));
    };
    img.src = url;
  });
}
