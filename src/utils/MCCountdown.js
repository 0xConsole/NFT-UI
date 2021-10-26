import { Component } from "react";

const formatValues = ({ days, hours, minutes, seconds }) => {
  const hourString = ("0" + hours).slice(-2);
  const minString = ("0" + minutes).slice(-2);
  const secString = ("0" + seconds).slice(-2);
  const dayString = ("0" + days).slice(-2);
  if (days > 0) {
    return (
      dayString +
      " Days " +
      hourString +
      " Hours " +
      minString +
      " Mins " +
      secString +
      " Secs"
    );
  }
  return hourString + " Hours " + minString + " Mins" + secString + " Secs";
};

class MCCountdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endDate: this.props.endDate,
      countdown: "0:00:00:00",
      secondRemaining: 0,
      id: 0,
      countdownValues: {},
    };
    this.initializeCountdown = this.initializeCountdown.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.endDate !== prevProps.endDate) {
      clearInterval(prevState.id);
      this.setState({ endDate: this.props.endDate });
      this.initializeCountdown();
    }
  }

  componentDidMount() {
    this.initializeCountdown();
  }

  tick() {
    const values = this.getTimeRemaining(this.state.endDate);
    this.setState({
      countdown: formatValues(values),
      secondRemaining: values.secondsLeft,
      countdownValues: values,
    });
    if (values.secondsLeft <= 0) {
      clearInterval(this.state.id);
      if (this.props.onComplete) {
        this.props.onComplete();
      }
      return;
    } else {
      if (this.props.onTick) {
        this.props.onTick(this.state.secondRemaining);
      }
    }
  }

  getTimeRemaining(endtime) {
    var total = endtime * 1000 - Date.parse(new Date());
    if (total < 0) total = 0;
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return {
      secondsLeft: total,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  initializeCountdown() {
    const values = this.getTimeRemaining(this.state.endDate);
    const id = setInterval(() => this.tick(), 1000);
    this.setState({
      id: id,
      countdown: formatValues(values),
      secondRemaining: values.secondsLeft,
      countdownValues: values,
    });
  }

  render() {
    const { countdown } = this.state;
    const { countdownValues } = this.state;
    return (
      <>
        <div className="h2 d-flex justify-content-center w-100">
          {countdownValues.days > 0 && (
            <div style={{ width: "6rem" }}>
              {("0" + countdownValues.days).slice(-2)}{" "}
              <span className="text-primary" style={{ fontSize: "16px" }}>
                Days
              </span>{" "}
            </div>
          )}
          <div style={{ width: "6rem" }}>
            {("0" + countdownValues.hours).slice(-2)}{" "}
            <span className="text-primary" style={{ fontSize: "16px" }}>
              Hours
            </span>{" "}
          </div>
          <div style={{ width: "6rem" }}>
            {("0" + countdownValues.minutes).slice(-2)}{" "}
            <span className="text-primary" style={{ fontSize: "16px" }}>
              Mins
            </span>{" "}
          </div>
          <div style={{ width: "6rem" }}>
            {("0" + countdownValues.seconds).slice(-2)}{" "}
            <span className="text-primary" style={{ fontSize: "16px" }}>
              Secs
            </span>{" "}
          </div>
        </div>
      </>
    );
  }
}

export default MCCountdown;
