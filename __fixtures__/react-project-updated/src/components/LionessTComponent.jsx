import AppBar from "@material-ui/core/AppBar";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { T } from "lioness";
import * as React from "react";

const styles = {
  title: {
    margin: "0 15px",
  },
};

class Header extends React.PureComponent {
  render() {
    const { classes } = this.props;

    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography className={classes.title} variant="h6" color="inherit">
            <T context="lion.title" message="Lion" />
            <T context="lion.title-two" message="Lion Two" />
            <T
              context="lion.children"
              message="Lion has one child"
              messagePlural="Lion has {{ count }} children"
            />
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);
