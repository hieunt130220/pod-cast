/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty } from "lodash";
import { useDispatch } from "react-redux";
import { toLowerCaseNonAccentVietnamese } from "../utils/string";
import { IconButton, TextField, Theme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: "flex",
      justifyContent: "center",
    },
    inputSearch: {
      marginLeft: "10px !important",
      width: "224px",
      "& .Mui-focused >.MuiButtonBase-root": {
        opacity: 1,
      },
      "& .MuiButtonBase-root": {
        opacity: 0.5,
      },
    },
    cssOutlinedInput: {
      "&$cssFocused $notchedOutline": {
        borderColor: `${theme.palette.primary.light} !important`,
      },
      "& input": {
        paddingRight: "4px",
      },
      backgroundColor: "transparent",
      borderRadius: "30px !important",
      height: 35,
      padding: "5px !important",
      margin: "auto",
    },
    notchedOutline: {
      border: `1px solid ${theme.palette.primary.light} !important`,
    },
    multilineColor: {
      fontSize: 13,
    },
    searchIcon: {
      marginRight: 10,
    },
  }),
  { index: 1 }
);

export default function InputSearch(props: any) {
  const { dataSearch, callSearchApi, searchByKeyword } = props;
  const classes = useStyles(props);

  const dispatch = useDispatch();

  const handleSearch = async (value: string) => {
    const data = await callSearchApi();
    let dataForSearch = dataSearch;
    if (!isEmpty(data)) dataForSearch = data;
    const valueSearch = toLowerCaseNonAccentVietnamese(value)?.trim();
    console.log(valueSearch);
    if (dataSearch) {
      dispatch(searchByKeyword(valueSearch, dataForSearch));
    }
  };

  return (
    <div className={classes.root}>
      <TextField
        classes={{ root: classes.inputSearch }}
        size="small"
        variant="outlined"
        placeholder="Press enter to search"
        InputLabelProps={{ shrink: false }}
        InputProps={{
          endAdornment: (
            <IconButton size="small">
              <SearchIcon />
            </IconButton>
          ),
          classes: {
            root: classes.cssOutlinedInput,
            notchedOutline: classes.notchedOutline,
          },
          className: classes.multilineColor,
        }}
        onKeyPress={(event: any) => {
          if (event.key === "Enter") {
            handleSearch(event.target?.value);
          }
        }}
      ></TextField>
    </div>
  );
}
