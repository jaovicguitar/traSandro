function startCamera () {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true })
        .then((stream) => {
            document.getElementById('videoFeed').srcObject = stream
        })
}
function stopCamera () {
    document.getElementById('videoFeed')
        .srcObject
        .getVideoTracks()
        .forEach(track => track.stop())
}

document.querySelector('.start-video').addEventListener('click', event => {
    startCamera()
})
document.querySelector('.stop-video').addEventListener('click', event => {
    stopCamera()
})

let videoRecorder = null
document.querySelector('.record-video').addEventListener('click', event => {
    let chunks = []
    const videoFeed = document.getElementById('videoFeed')
    // caso não estejamos gravando, começaremos
    if (!videoRecorder) {
        // vamos usar o mesmo stream que já está ativo em nosso vídeo
        const stream = videoFeed.srcObject

        videoRecorder = new MediaRecorder(stream)
        videoRecorder.start(3000)

        // sempre que um novo chunk estiver pronto, ou
        // quando a gravação for finalizada
        videoRecorder.ondataavailable = event => {
            // nós simplesmente armazenaremos o novo chunk
            chunks.push(event.data)
        }
   
        // e, finalmente, quando a gravação é finalizada
        videoRecorder.onstop = event => {
            // nós montaremos um blob a partir de nossos chunks
            // nesse caso, no formato de vídeo/mp4
            let blob = new Blob(chunks, { 'type' : 'video/mp4' })
            // e podemos usar o nosso blob, aqui, à vontade
            URL.createObjectURL(blob)

            if(!contentType){
                contentType = 'application/octet-stream';
            }
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = filename;
            a.click();
        }

    } else {
        // se o vídeo estava sendo gravado, quer dizer que o usuário
        // quer finalizar a gravação
        videoRecorder.stop()
        // e podemos também finalizar a câmera
        stopCamera()
    }
})