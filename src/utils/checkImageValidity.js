async function checkImageValidity(imageUrl) {
  if (imageUrl.startsWith('data:image')) {
    console.log('Image URL is a base64 data string');
    return false;
  }

  if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    console.log('Image URL is not an external link');
    return false;
  }

  try {
    await loadImage(imageUrl);
    console.log('Image is valid');
    return true;
  } catch (error) {
    console.log('Image is not valid');
    return false;
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });
}

export default checkImageValidity;
