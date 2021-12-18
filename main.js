const playStream = (idVideoTag, stream) => {
  const video = document.getElementById(idVideoTag);
  video.srcObject = stream;
  video.play();
};

// openStream().then((stream) => playStream('localStream', stream));

const peer = new Peer();
peer.on('open', (id) => $('#peerID').append(id));

$('#btnCall').on('click', async () => {
  const id = await $('#remoteID').val();
  let getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
  getUserMedia(
    { video: true, audio: true },
    function (stream) {
      const call = peer.call(id, stream);
      call.on('stream', function (remoteStream) {
        playStream('remoteStream', remoteStream);
      });
    },
    function (err) {
      console.log('Failed to get local stream', err);
    }
  );
});

peer.on('call', function (call) {
  let getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
  getUserMedia(
    { video: true, audio: true },
    function (stream) {
      call.answer(stream); // Answer the call with an A/V stream.
      call.on('stream', function (remoteStream) {
        playStream('remoteStream', remoteStream);
      });
    },
    function (err) {
      console.log('Failed to get local stream', err);
    }
  );
});
