object = [];
status = "";


function setup() {
    canvas = createCanvas(400, 400)
    canvas.position(450, 150)
    video = createCapture(VIDEO)
    video.hide()

}

function start() {
    objectDetector = ml5.objectDetector('cocossd', modelLoaded)
    document.getElementById("status").innerHTML = "status : detecting object"
    object_name = document.getElementById("object_name").value
}

function modelLoaded() {
    console.log("model started loading")
    status = true
}

function gotResult(error, result) {
    if (error) {
        console.error(error);
    }
    else {
        console.log(result)
        object = result
    }
}

function draw() {
    image(video, 0, 0, 400, 400)
    if (status != "") {
        objectDetector.detect(video, gotResult)
        for (i = 0; i < object.length; i++) {
            document.getElementById("status").innerHTML = "status : object detected"
            fill("black")
            percent = (floor(object[i].confidence * 100))
            text(object[i].label + " " + percent + "%", object[i].x + 15, object[i].y + 15)
            stroke("magenta")
            noFill()
            rect(object[i].x, object[i].y, object[i].width, object[i].height)

            if (object[i].label == object_name) {
                video.stop()
                objectDetector.detect(gotResult)
                document.getElementById("object_status").innerHTML = object_name + " found"
                synth = window.speechSynthesis
                utterThis = new SpeechSynthesisUtterance(object_name + " found")
                synth.speak(utterThis)
            }
            else {
                document.getElementById("object_status").innerHTML = object_name + " not found"
            }
        }
    }
}