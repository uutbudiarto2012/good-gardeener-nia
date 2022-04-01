import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: "8px",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const SearchBar = (props) => {
  const { handleSearch } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Masukkan kata kunci disini dan tekan enter"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearch(e.target.value);
          }
        }}
      />
      {/* <IconButton
        onClick={(e)=>console.log(e.target.value)}
        type="submit"
        className={classes.iconButton}
        aria-label="search"
      >
      </IconButton> */}
        <SearchIcon style={{ color:"#888" }} className={classes.iconButton} />
    </div>
  );
};

export default SearchBar;
