export function startTime() {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    m = checkTime(m);
    document.getElementById('hora').innerHTML = h + ":" + m;
    let t = setTimeout(startTime, 1000);
}
 export function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    };
    return i;
}