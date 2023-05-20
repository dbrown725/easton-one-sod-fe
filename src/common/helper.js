import DOMPurify from "dompurify";

export const getThumbnailLink = (videoLink, quality) => {
  var file = "";
  if (quality === "default") {
    file = "default.jpg";
  } else if (quality === "medium") {
    file = "mqdefault.jpg";
  } else if (quality === "high") {
    file = "hqdefault.jpg";
  } else if (quality === "standard") {
    file = "sddefault.jpg";
  } else if (quality === "maxres") {
    file = "maxresdefault.jpg";
  } else {
    file = "default.jpg";
  }

  var videoId = "";
  var linkLength = videoLink.length;
  if(videoLink.startsWith("https://www.youtube.com") && linkLength >= 43) {
    videoId = videoLink.substring(32,43);        
  } else if(videoLink.startsWith("https://youtu.be") && linkLength >= 28) {
    videoId = videoLink.substring(17,28);        
  }
  if(videoId !== "") {
    return "https://i.ytimg.com/vi/" + videoId + "/" + file;
  } else {
    return "";
  }
};

export const sanitizeData = (dirty) => {
  const clean = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [ 'em' ],
  });
  return clean;
}

export const highlightMatches = (raw) => {
  return raw.replaceAll('em>', 'mark>');
}