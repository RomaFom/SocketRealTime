import * as React from "react";
import * as ReactDOM from "react-dom";
import { LinearGauge } from "@progress/kendo-react-gauges";

const LinearGaugeComponent = (props) => {
  const [value, setValue] = React.useState(0);

  const linearOptions = {
    pointer: {
      value: props.value,
    },
  };
  return <LinearGauge {...linearOptions} />;
};

export default LinearGaugeComponent;
