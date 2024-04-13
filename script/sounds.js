function playBackgroundAudio() {
    let audio = new Audio("../assets/audio/menu_sound_track.mp3");
    audio.play();
    audio.loop = "loop";
    audio.volume = "0.2"
}
function playClickAudio() {
    let audio = new Audio("../assets/audio/click.m4a")
    audio.play();
}