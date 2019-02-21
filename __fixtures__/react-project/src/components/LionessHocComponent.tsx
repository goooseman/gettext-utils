// tslint:disable

// @ts-ignore
import { withTranslators } from "lioness";
import * as React from "react";

class Header extends React.PureComponent<{
  tp(content: string, message: string): string;
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
    this.props.tp("lion.sound", `Rrrrr`);
  };

  private getFemaleLions = () => {
    this.props.tnp(
      "lion.females",
      "one female lion",
      "{{ count }} female lions",
      5,
    );
  };
}

export default withTranslators(Header);
