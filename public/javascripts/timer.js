//ts-check
const timer = function(){
    this.min = 0;
    this.sec = 0;
    this.stoptime = true;
    this.startTimer();
};

timer.prototype.startTimer() = function() {
  if (this.stoptime == true) {
        this.stoptime = false;
        this.timerCycle();
    }
}
timer.prototype.stopTimer() = function(){
  if (this.stoptime == false) {
    this.stoptime = true;
  }
}

timer.prototype.timerCycle() = function(){
    if (this.stoptime == false) {
        this.sec = parseInt(this.sec);
        this.min = parseInt(this.min);

        this.sec = this.sec + 1;

    if (this.sec == 60) {
        this.min = this.min + 1;
        this.sec = 0;
    }

    if (this.sec < 10 || this.sec == 0) {
        this.sec = '0' + this.sec;
    }
    if (this.min < 10 ||this.min == 0) {
        this.min = '0' + this.min;
    }

    document.getElementById('timer').innerHTML ="Time spent:" + this.min + ':' + this.sec;

    setTimeout("this.timerCycle()", 1000);
  }
}
