// tslint:disable

// @ts-ignore
import { withTranslators } from "lioness";
import * as React from "react";

class Header extends React.PureComponent<{
  tp(context: string, message: string): string;
  tnp(context: string, one: string, other: string, count: number): string;
}> {
  public render() {
    return (
      <span>
        Male lion says {this.getLionSound()} to {this.getFemaleLions()}!
      </span>
    );
  }

  private getLionSound = () => {
    this.props.tp(
      "",
      `80 chars long string: asdasdasd asdasda asdasd asd a sdas dasd asd asda dsasd fu`,
    );
  };

  private getFemaleLions = () => {
    this.props.tnp(
      "",
      "81 chars long string: asdasdasd asdasda asdasd asd a sdas dasd asd asda dsasd fuc",
      "{{ count }} 81 chars long string: asdasdasd asdasda asdasd asd a sdas dasd as fuc",
      5,
    );
  };
}

export default withTranslators(Header);
