const p = navigator.mediaDevices.getUserMedia({ audio: true, video: true });

p.then(function(mediaStream) {
  const video = document.querySelector('video');
  video.src = window.URL.createObjectURL(mediaStream);
  console.log('camara funcionando');
  //
  video.onloadedmetadata = function(e) {
    // Do something with the video here.
  };
});

p.catch(function(err) { console.log(err.name); }); // always check for errors at the end.
